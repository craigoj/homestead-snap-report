import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Camera, Upload, X, ImageIcon, Shield } from 'lucide-react';
import { extractEXIFData, generatePhotoHash } from '@/lib/exifExtractor';

interface PhotoUploadProps {
  onPhotosUploaded: (photos: string[]) => void;
  maxPhotos?: number;
  existingPhotos?: string[];
}

export const PhotoUpload = ({ onPhotosUploaded, maxPhotos = 5, existingPhotos = [] }: PhotoUploadProps) => {
  const { user } = useAuth();
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>(existingPhotos);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload photos.",
        variant: "destructive",
      });
      return;
    }

    if (uploadedPhotos.length + files.length > maxPhotos) {
      toast({
        title: "Too Many Photos",
        description: `You can only upload up to ${maxPhotos} photos.`,
        variant: "destructive",
      });
      return;
    }

    // Preflight check: Verify storage access before uploading
    try {
      const { error: preflightError } = await supabase.storage
        .from('asset-photos')
        .list(user.id, { limit: 1 });
      
      if (preflightError) {
        console.error('Storage preflight failed:', preflightError);
        console.log('User ID:', user.id);
        toast({
          title: "Storage Access Error",
          description: `Cannot access your storage folder. ${preflightError.message}. Please try signing out and back in.`,
          variant: "destructive",
        });
        return;
      }
      console.log('Storage preflight OK');
    } catch (e) {
      console.error('Storage preflight exception:', e);
    }

    setUploading(true);
    
    try {
      const newPhotos: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid File Type",
            description: `${file.name} is not an image file.`,
            variant: "destructive",
          });
          continue;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File Too Large",
            description: `${file.name} is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Please use "Choose Files" and select images under 5MB.`,
            variant: "destructive",
          });
          continue;
        }

        // Extract EXIF data and generate hash for photo integrity
        console.log('Extracting EXIF data and generating hash...');
        const exifData = await extractEXIFData(file);
        const photoHash = await generatePhotoHash(file);
        console.log('EXIF extracted:', exifData.photoTakenAt ? `Photo taken on ${exifData.photoTakenAt}` : 'No date');
        console.log('Photo hash:', photoHash.substring(0, 16) + '...');

        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${i}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        console.log('Uploading file:', fileName, 'to path:', filePath, 'size:', (file.size / 1024 / 1024).toFixed(2) + 'MB');

        // Store EXIF metadata for later (will be saved to asset_photos table)
        const photoMetadata = {
          exif_data: exifData.exifData,
          photo_taken_at: exifData.photoTakenAt,
          photo_hash: photoHash,
          gps_coordinates: exifData.gpsCoordinates,
          camera_make: exifData.cameraMake,
          camera_model: exifData.cameraModel,
          original_filename: exifData.originalFilename,
        };

        const { data, error: uploadError } = await supabase.storage
          .from('asset-photos')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type || 'image/jpeg',
          });

        if (uploadError) {
          console.error('Upload error details:', uploadError);
          
          // Try signed URL upload as fallback
          console.log('Attempting signed URL upload fallback...');
          try {
            const { data: signedData, error: signedError } = await supabase.storage
              .from('asset-photos')
              .createSignedUploadUrl(filePath);
            
            if (signedError) {
              console.error('Signed URL creation failed:', signedError);
              toast({
                title: "Upload Failed",
                description: `Failed to upload ${file.name}: ${uploadError.message}`,
                variant: "destructive",
              });
              continue;
            }

            const { error: uploadToSignedError } = await supabase.storage
              .from('asset-photos')
              .uploadToSignedUrl(signedData.path, signedData.token, file, {
                contentType: file.type || 'image/jpeg',
              });

            if (uploadToSignedError) {
              console.error('Signed URL upload failed:', uploadToSignedError);
              toast({
                title: "Upload Failed",
                description: `Failed to upload ${file.name}: ${uploadToSignedError.message}`,
                variant: "destructive",
              });
              continue;
            }

            console.log('Upload successful via signed URL');
            newPhotos.push(filePath);
            // Show photo verification badge if EXIF date is available
            if (exifData.photoTakenAt) {
              toast({
                title: "Photo Verified",
                description: `${Shield} Photo taken on ${new Date(exifData.photoTakenAt).toLocaleDateString()}`,
              });
            }
          } catch (fallbackError: any) {
            console.error('Fallback upload exception:', fallbackError);
            toast({
              title: "Upload Failed",
              description: `Failed to upload ${file.name}: ${uploadError.message}`,
              variant: "destructive",
            });
            continue;
          }
        } else {
          console.log('Upload successful:', data);
          newPhotos.push(filePath);
          // Show photo verification badge if EXIF date is available
          if (exifData.photoTakenAt) {
            toast({
              title: "Photo Verified",
              description: `Photo taken on ${new Date(exifData.photoTakenAt).toLocaleDateString()}`,
            });
          }
        }
      }

      if (newPhotos.length > 0) {
        const updatedPhotos = [...uploadedPhotos, ...newPhotos];
        setUploadedPhotos(updatedPhotos);
        onPhotosUploaded(updatedPhotos);

        toast({
          title: "Photos Uploaded",
          description: `${newPhotos.length} photo(s) uploaded successfully.`,
        });
      } else {
        toast({
          title: "Upload Failed",
          description: "No photos were uploaded. Please try again.",
          variant: "destructive",
        });
      }
      
    } catch (error: any) {
      console.error('Upload exception:', error);
      toast({
        title: "Upload Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }, [uploadedPhotos, maxPhotos, onPhotosUploaded, user]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    console.log('Drop event triggered, files:', e.dataTransfer.files.length);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const removePhoto = (index: number) => {
    const updatedPhotos = uploadedPhotos.filter((_, i) => i !== index);
    setUploadedPhotos(updatedPhotos);
    onPhotosUploaded(updatedPhotos);
  };

  const triggerCamera = () => {
    console.log('Camera triggered');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.setAttribute('capture', 'environment'); // Use rear camera on mobile
    input.multiple = maxPhotos > 1;
    input.onchange = (e) => {
      console.log('Camera input change event');
      const files = (e.target as HTMLInputElement).files;
      console.log('Files selected from camera:', files?.length || 0);
      handleFileSelect(files);
    };
    input.click();
  };

  const triggerFileSelect = () => {
    console.log('File select triggered');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = maxPhotos > 1;
    input.onchange = (e) => {
      console.log('File input change event');
      const files = (e.target as HTMLInputElement).files;
      console.log('Files selected:', files?.length || 0);
      handleFileSelect(files);
    };
    input.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card
        className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={triggerFileSelect}
      >
        <div className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-muted rounded-full">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-medium mb-2">Upload Photos</h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop images here, or click to select files
          </p>
          <div className="flex justify-center space-x-2">
            <Button type="button" variant="outline" onClick={(e) => {
              e.stopPropagation();
              triggerCamera();
            }}>
              <Camera className="mr-2 h-4 w-4" />
              Take Photo
            </Button>
            <Button type="button" variant="outline" onClick={(e) => {
              e.stopPropagation();
              triggerFileSelect();
            }}>
              <Upload className="mr-2 h-4 w-4" />
              Choose Files
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Maximum {maxPhotos} photos • Up to 5MB each • JPG, PNG, WebP
          </p>
        </div>
      </Card>

      {/* Photo Previews */}
      {uploadedPhotos.length > 0 && (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {uploadedPhotos.map((photo, index) => (
            <Card key={index} className="relative group">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img 
                src={`https://hfiznpxdopjdwtuenxqf.supabase.co/storage/v1/object/public/asset-photos/${photo}`}
                alt={`Asset photo ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to icon if image fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    const icon = document.createElement('div');
                    icon.className = 'w-full h-full flex items-center justify-center';
                    icon.innerHTML = '<svg class="h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                    parent.appendChild(icon);
                  }
                }}
              />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {index === 0 && (
                <div className="absolute top-2 left-2">
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                    Primary
                  </span>
                </div>
              )}
            </Card>
          ))}
          
          {/* Add More Button */}
          {uploadedPhotos.length < maxPhotos && (
            <Card 
              className="aspect-square border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer"
              onClick={triggerFileSelect}
            >
              <div className="w-full h-full flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Add More</span>
              </div>
            </Card>
          )}
        </div>
      )}

      {uploading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span>Uploading photos...</span>
          </div>
        </div>
      )}
    </div>
  );
};
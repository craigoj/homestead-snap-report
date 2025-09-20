import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PhotoUpload } from '@/components/PhotoUpload';
import { PropertyRoomSelector } from '@/components/PropertyRoomSelector';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { 
  Camera, 
  Package, 
  DollarSign,
  Calendar,
  FileText,
  Zap,
  AlertCircle
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface AssetForm {
  title: string;
  description: string;
  category: string;
  brand: string;
  model: string;
  serial_number: string;
  condition: string;
  estimated_value: string;
  purchase_date: string;
  purchase_price: string;
  property_id: string;
  room_id: string;
}

const categories = [
  'electronics', 'furniture', 'appliances', 'jewelry', 
  'clothing', 'art', 'books', 'tools', 'sports', 'other'
];

const conditions = ['excellent', 'good', 'fair', 'poor'];

export default function AddAsset() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [formData, setFormData] = useState<AssetForm>({
    title: '',
    description: '',
    category: '',
    brand: '',
    model: '',
    serial_number: '',
    condition: 'good',
    estimated_value: '',
    purchase_date: '',
    purchase_price: '',
    property_id: '',
    room_id: '',
  });

  const handlePhotoUpload = async (photos: string[]) => {
    setUploadedPhotos(photos);
    
    if (photos.length > 0) {
      // Trigger OCR extraction for the first photo
      await performOCR(photos[0]);
    }
  };

  const performOCR = async (photoPath: string) => {
    setOcrLoading(true);
    try {
      // This is a placeholder for OCR functionality
      // In a real implementation, this would call an edge function
      
      // Simulate OCR processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock OCR results
      const mockResults = {
        title: 'Samsung 55" Smart TV',
        brand: 'Samsung',
        model: 'UN55TU8000',
        category: 'electronics',
        estimated_value: '650',
      };

      setFormData(prev => ({
        ...prev,
        ...mockResults,
      }));

      toast({
        title: "OCR Complete",
        description: "Asset details have been extracted from the photo. Please review and edit as needed.",
      });

      // Log OCR success
      await supabase.rpc('log_audit_event', {
        p_event_type: 'ocr_success',
        p_entity_type: 'asset',
        p_metadata: { confidence: 0.85, extracted_fields: Object.keys(mockResults) }
      });

    } catch (error: any) {
      toast({
        title: "OCR Failed",
        description: "Couldn't extract details from the photo. Please enter details manually.",
        variant: "destructive",
      });

      // Log OCR failure
      await supabase.rpc('log_audit_event', {
        p_event_type: 'ocr_fail',
        p_entity_type: 'asset',
        p_metadata: { error: error.message }
      });
    } finally {
      setOcrLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter an asset title.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.property_id) {
      toast({
        title: "Property Required", 
        description: "Please select a property for this asset.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Create the asset
      const { data: asset, error: assetError } = await supabase
        .from('assets')
        .insert([{
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          category: formData.category as any || 'other',
          brand: formData.brand.trim() || null,
          model: formData.model.trim() || null,
          serial_number: formData.serial_number.trim() || null,
          condition: formData.condition as any,
          estimated_value: formData.estimated_value ? parseFloat(formData.estimated_value) : null,
          purchase_date: formData.purchase_date || null,
          purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
          property_id: formData.property_id,
          room_id: formData.room_id || null,
          ocr_extracted: uploadedPhotos.length > 0,
          ocr_confidence: uploadedPhotos.length > 0 ? 0.85 : null,
        }])
        .select()
        .single();

      if (assetError) throw assetError;

      // Create photo records if any photos were uploaded
      if (uploadedPhotos.length > 0 && asset) {
        const photoRecords = uploadedPhotos.map((photoPath, index) => ({
          asset_id: asset.id,
          file_path: photoPath,
          file_name: `photo_${index + 1}.jpg`,
          is_primary: index === 0,
        }));

        const { error: photoError } = await supabase
          .from('asset_photos')
          .insert(photoRecords);

        if (photoError) throw photoError;
      }

      toast({
        title: "Asset Created",
        description: `${formData.title} has been added to your inventory.`,
      });

      // Log asset creation
      await supabase.rpc('log_audit_event', {
        p_event_type: 'asset_created',
        p_entity_type: 'asset', 
        p_entity_id: asset.id,
        p_metadata: { 
          title: formData.title,
          category: formData.category,
          estimated_value: formData.estimated_value,
          has_photos: uploadedPhotos.length > 0
        }
      });

      // Navigate to dashboard or asset detail
      navigate('/dashboard');
      
    } catch (error: any) {
      toast({
        title: "Error Creating Asset",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Asset</h1>
        <p className="text-muted-foreground">
          Take photos or enter details manually to add items to your inventory.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Photo Upload Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Camera className="h-5 w-5 text-primary" />
                <CardTitle>Photos</CardTitle>
              </div>
              <CardDescription>
                Take photos of your asset. We'll automatically extract details using AI.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PhotoUpload 
                onPhotosUploaded={handlePhotoUpload}
                maxPhotos={5}
              />
              {ocrLoading && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2 text-sm">
                    <Zap className="h-4 w-4 animate-pulse text-primary" />
                    <span>Extracting details from photo...</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Property & Room Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-primary" />
                <CardTitle>Location</CardTitle>
              </div>
              <CardDescription>
                Choose where this asset is located.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PropertyRoomSelector
                selectedPropertyId={formData.property_id}
                selectedRoomId={formData.room_id}
                onPropertyChange={(propertyId) => 
                  setFormData(prev => ({ ...prev, property_id: propertyId, room_id: '' }))
                }
                onRoomChange={(roomId) => 
                  setFormData(prev => ({ ...prev, room_id: roomId }))
                }
              />
            </CardContent>
          </Card>
        </div>

        {/* Asset Details */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Details</CardTitle>
            <CardDescription>
              Provide information about your asset. Fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Samsung Smart TV"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => 
                  setFormData({...formData, category: value})
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category} className="capitalize">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Additional details about this item..."
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  placeholder="e.g., Samsung"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  placeholder="e.g., UN55TU8000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="serial">Serial Number</Label>
                <Input
                  id="serial"
                  value={formData.serial_number}
                  onChange={(e) => setFormData({...formData, serial_number: e.target.value})}
                  placeholder="e.g., ABC123XYZ"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select value={formData.condition} onValueChange={(value) => 
                  setFormData({...formData, condition: value})
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition} value={condition} className="capitalize">
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estimated_value">Estimated Value</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="estimated_value"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.estimated_value}
                    onChange={(e) => setFormData({...formData, estimated_value: e.target.value})}
                    placeholder="0.00"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="purchase_price">Purchase Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="purchase_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.purchase_price}
                    onChange={(e) => setFormData({...formData, purchase_price: e.target.value})}
                    placeholder="0.00"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchase_date">Purchase Date</Label>
              <Input
                id="purchase_date"
                type="date"
                value={formData.purchase_date}
                onChange={(e) => setFormData({...formData, purchase_date: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || ocrLoading}>
            {loading ? 'Creating...' : 'Create Asset'}
          </Button>
        </div>
      </form>
    </div>
  );
}
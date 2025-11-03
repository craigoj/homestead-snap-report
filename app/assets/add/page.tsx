'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PhotoUpload } from '@/components/PhotoUpload';
import { PropertyRoomSelector } from '@/components/PropertyRoomSelector';
import { OCRReviewModal } from '@/components/OCRReviewModal';
import { HighValueAlert } from '@/components/HighValueAlert';
import { AppraisalUpload } from '@/components/AppraisalUpload';
import { ValuationInsights } from '@/components/ValuationInsights';
import { CelebrationModal } from '@/components/jumpstart/CelebrationModal';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useJumpstartSession } from '@/hooks/useJumpstartSession';
import { toast } from 'sonner';
import { getPromptsForMode, inferCategoryFromPrompt } from '@/lib/jumpstart/prompts';
import { parseMoney, parseConfidence } from '@/lib/numberUtils';
import {
  Camera,
  Package,
  DollarSign,
  Calendar,
  FileText,
  Zap,
  AlertCircle,
  Brain,
  TrendingUp,
  CheckCircle,
  Edit
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, completePrompt } = useJumpstartSession();

  // Jumpstart mode detection
  const isJumpstart = searchParams.get('jumpstart') === 'true';
  const jumpstartMode = searchParams.get('mode') || 'quick-win';
  const promptIndex = parseInt(searchParams.get('prompt') || '1') - 1;
  const sessionId = searchParams.get('sessionId');

  // Load current prompt if in jumpstart mode
  const currentPrompt = isJumpstart ? getPromptsForMode(jumpstartMode)[promptIndex] : null;

  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [valuationLoading, setValuationLoading] = useState(false);
  const [valuationResult, setValuationResult] = useState<any>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [showOCRReview, setShowOCRReview] = useState(false);
  const [ocrImageUrl, setOcrImageUrl] = useState<string>('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [createdAssetId, setCreatedAssetId] = useState<string>('');
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

  // Auto-trigger AI valuation in jumpstart mode when title and category are available
  useEffect(() => {
    if (isJumpstart && formData.title && formData.category && !valuationResult && !valuationLoading) {
      // Small delay to avoid triggering too early
      const timer = setTimeout(() => {
        getAIValuation();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isJumpstart, formData.title, formData.category]);

  // Auto-set category from prompt in jumpstart mode
  useEffect(() => {
    if (isJumpstart && currentPrompt && !formData.category) {
      const suggestedCategory = inferCategoryFromPrompt(currentPrompt.id);
      setFormData(prev => ({
        ...prev,
        category: suggestedCategory
      }));
    }
  }, [isJumpstart, currentPrompt, formData.category]);

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
      console.log('Processing enhanced OCR for:', photoPath);

      // Get the full URL for the image
      const { data: { publicUrl } } = supabase.storage
        .from('asset-photos')
        .getPublicUrl(photoPath);

      setOcrImageUrl(publicUrl);

      // Call the enhanced OCR edge function
      const { data: enhancedResult, error: ocrError } = await supabase.functions.invoke('ocr-enhanced-extract', {
        body: { imageUrl: publicUrl }
      });

      if (ocrError) {
        throw new Error(ocrError.message);
      }

      if (!enhancedResult) {
        throw new Error('No OCR result returned');
      }

      console.log('Enhanced OCR Result:', enhancedResult);
      setOcrResult(enhancedResult);

      // Auto-apply results if confidence is high (80% or above)
      if (enhancedResult.confidence >= 80) {
        applyOCRResult(enhancedResult);
        toast.success(`Information extracted with ${enhancedResult.confidence}% confidence and auto-applied.`);
      } else {
        // Show review modal for lower confidence results
        setShowOCRReview(true);
        toast.info(`Extraction completed with ${enhancedResult.confidence}% confidence. Please review the results.`);
      }

      // Log OCR success
      await supabase.rpc('log_audit_event', {
        p_event_type: 'ocr_success',
        p_entity_type: 'asset',
        p_metadata: {
          confidence: enhancedResult.confidence,
          provider: enhancedResult.provider,
          extracted_text: enhancedResult.extracted_text
        }
      });

    } catch (error: any) {
      console.error('Enhanced OCR processing failed:', error);

      toast.error("Couldn't extract details from the photo. Please enter details manually.");

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

  const applyOCRResult = (result: any) => {
    setFormData(prev => ({
      ...prev,
      title: result.title || prev.title,
      description: result.description || prev.description,
      brand: result.brand || prev.brand,
      model: result.model || prev.model,
      serial_number: result.serial_number || prev.serial_number,
      category: result.category || prev.category,
      estimated_value: result.estimated_value?.toString() || prev.estimated_value,
    }));
  };

  const handleOCRAccept = (correctedResult: any) => {
    applyOCRResult(correctedResult);
    setOcrResult(correctedResult);
    toast.success("The extracted information has been applied to the form.");
  };

  const handleOCRReject = () => {
    setOcrResult(null);
    toast.info("You can enter the information manually.");
  };

  const retryOCR = () => {
    if (uploadedPhotos.length > 0) {
      performOCR(uploadedPhotos[0]);
    }
  };

  const getAIValuation = async () => {
    if (!formData.title || !formData.category || !formData.condition) {
      toast.error("Please fill in title, category, and condition before getting AI valuation.");
      return;
    }

    setValuationLoading(true);
    try {
      const valuationData = {
        title: formData.title,
        description: formData.description,
        brand: formData.brand,
        model: formData.model,
        category: formData.category,
        condition: formData.condition,
        purchase_date: formData.purchase_date,
        purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : undefined,
        imageUrl: uploadedPhotos.length > 0 ? supabase.storage.from('asset-photos').getPublicUrl(uploadedPhotos[0]).data.publicUrl : undefined
      };

      const { data: result, error } = await supabase.functions.invoke('valuation-estimate', {
        body: valuationData
      });

      if (error) throw error;

      setValuationResult(result);

      toast.success(`Estimated value: $${result.estimated_value} (${result.confidence}% confidence)`);

      // Log valuation request
      await supabase.rpc('log_audit_event', {
        p_event_type: 'asset_created', // Using existing event type
        p_entity_type: 'asset',
        p_metadata: {
          action: 'ai_valuation',
          estimated_value: result.estimated_value,
          confidence: result.confidence
        }
      });

    } catch (error: any) {
      console.error('AI valuation failed:', error);
      toast.error("Couldn't get AI valuation. Please try again or enter value manually.");
    } finally {
      setValuationLoading(false);
    }
  };

  const acceptAIValuation = () => {
    if (valuationResult) {
      setFormData(prev => ({
        ...prev,
        estimated_value: valuationResult.estimated_value.toString()
      }));
      setValuationResult(null);
      toast.success(`Set estimated value to $${valuationResult.estimated_value}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter an asset title.");
      return;
    }

    if (!formData.property_id) {
      toast.error("Please select a property for this asset.");
      return;
    }

    // Validate and sanitize numeric fields to prevent overflow
    const sanitizedEstimated = formData.estimated_value
      ? parseMoney(formData.estimated_value)
      : null;

    const sanitizedPurchase = formData.purchase_price
      ? parseMoney(formData.purchase_price)
      : null;

    const ocrConf = parseConfidence(ocrResult?.confidence);

    if (formData.estimated_value && sanitizedEstimated === null) {
      toast.error("Please enter a valid estimated value (0 to 999,999,999).");
      return;
    }

    if (formData.purchase_price && sanitizedPurchase === null) {
      toast.error("Please enter a valid purchase price (0 to 999,999,999).");
      return;
    }

    console.log('Sanitized values before insert:', {
      estimated_value: sanitizedEstimated,
      purchase_price: sanitizedPurchase,
      ocr_confidence: ocrConf
    });

    setLoading(true);

    try {
      // Create the asset
      const { data: asset, error: assetError } = await supabase
        .from('assets')
        .insert([{
          user_id: user!.id,
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          category: formData.category as any || 'other',
          brand: formData.brand.trim() || null,
          model: formData.model.trim() || null,
          serial_number: formData.serial_number.trim() || null,
          condition: formData.condition as any,
          estimated_value: sanitizedEstimated,
          purchase_date: formData.purchase_date || null,
          purchase_price: sanitizedPurchase,
          property_id: formData.property_id,
          room_id: formData.room_id || null,
          ocr_extracted: uploadedPhotos.length > 0 && ocrResult !== null,
          ocr_confidence: ocrConf,
          ocr_provider: ocrResult?.provider || null,
          ocr_raw_text: ocrResult?.raw_text || null,
          ocr_metadata: ocrResult?.metadata || null,
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

      // Log asset creation
      await supabase.rpc('log_audit_event', {
        p_event_type: 'asset_created',
        p_entity_type: 'asset',
        p_entity_id: asset.id,
        p_metadata: {
          title: formData.title,
          category: formData.category,
          estimated_value: formData.estimated_value,
          has_photos: uploadedPhotos.length > 0,
          jumpstart_mode: isJumpstart
        }
      });

      // Handle jumpstart mode vs regular mode
      if (isJumpstart && session) {
        // Complete the prompt in the jumpstart session
        await completePrompt(asset.id, sanitizedEstimated || 0);

        // Store asset ID and show celebration modal
        setCreatedAssetId(asset.id);
        setShowCelebration(true);
      } else {
        // Regular mode - show toast and navigate
        toast.success(`${formData.title} has been added to your inventory.`);
        router.push('/dashboard');
      }

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCelebrationContinue = () => {
    setShowCelebration(false);

    if (!session) return;

    const prompts = getPromptsForMode(jumpstartMode);
    const nextPromptIndex = promptIndex + 1;

    // Check if there are more prompts
    if (nextPromptIndex < prompts.length) {
      // Navigate to next prompt
      router.push(`/jumpstart/guide?mode=${jumpstartMode}`);
    } else {
      // All prompts complete - go to completion screen
      router.push('/jumpstart/complete');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isJumpstart && currentPrompt ? `Scan your ${currentPrompt.item}` : 'Add New Asset'}
        </h1>
        <p className="text-muted-foreground">
          {isJumpstart && currentPrompt
            ? currentPrompt.rationale
            : 'Take photos or enter details manually to add items to your inventory.'
          }
        </p>
      </div>

      {/* Jumpstart Progress Indicator */}
      {isJumpstart && session && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  Item {promptIndex + 1} of {session.items_target}
                </p>
                <p className="text-sm text-muted-foreground">
                  💎 Total Protected: ${session.total_value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Typical value: {currentPrompt?.typicalValue}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                    <span>Extracting details from photo using enhanced OCR...</span>
                  </div>
                </div>
              )}

              {ocrResult && !ocrLoading && (
                <div className="mt-4 p-4 bg-muted rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-sm">OCR Extraction Complete</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">
                        {ocrResult.confidence}% confidence • {ocrResult.provider} provider
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowOCRReview(true)}
                        className="h-6 px-2"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Review
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Text Quality:</span>
                      <span className="ml-1 font-medium">
                        {ocrResult.metadata?.text_confidence || ocrResult.confidence}%
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Structure Quality:</span>
                      <span className="ml-1 font-medium">
                        {ocrResult.metadata?.structure_confidence || ocrResult.confidence}%
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={retryOCR} disabled={ocrLoading}>
                      Retry OCR
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowOCRReview(true)}>
                      Review & Edit
                    </Button>
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
                {isJumpstart && currentPrompt && formData.category && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Zap className="h-3 w-3 text-primary" />
                    Auto-suggested based on "{currentPrompt.item}"
                  </p>
                )}
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

            {!isJumpstart && (
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
            )}

            {/* High-Value Item Alert */}
            {formData.estimated_value && parseFloat(formData.estimated_value) > 0 && (
              <HighValueAlert
                estimatedValue={parseFloat(formData.estimated_value)}
                category={formData.category}
              />
            )}

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
                <div className="flex items-center justify-between">
                  <Label htmlFor="estimated_value">Estimated Value</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={getAIValuation}
                    disabled={valuationLoading || !formData.title || !formData.category || !formData.condition}
                  >
                    {valuationLoading ? (
                      <>
                        <Zap className="mr-2 h-3 w-3 animate-pulse" />
                        Getting AI Value...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-3 w-3" />
                        Get AI Value
                      </>
                    )}
                  </Button>
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="estimated_value"
                    type="number"
                    step="0.01"
                    min="0"
                    max="999999999"
                    value={formData.estimated_value}
                    onChange={(e) => setFormData({...formData, estimated_value: e.target.value})}
                    placeholder="0.00"
                    className="pl-10"
                  />
                </div>
                {valuationResult && (
                  <>
                    <ValuationInsights valuation={valuationResult} />
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={acceptAIValuation}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Accept This Value
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setValuationResult(null)}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </>
                )}
              </div>

              {!isJumpstart && (
                <div className="space-y-2">
                  <Label htmlFor="purchase_price">Purchase Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="purchase_price"
                      type="number"
                      step="0.01"
                      min="0"
                      max="999999999"
                      value={formData.purchase_price}
                      onChange={(e) => setFormData({...formData, purchase_price: e.target.value})}
                      placeholder="0.00"
                      className="pl-10"
                    />
                  </div>
                </div>
              )}
            </div>

            {!isJumpstart && (
              <div className="space-y-2">
                <Label htmlFor="purchase_date">Purchase Date</Label>
                <Input
                  id="purchase_date"
                  type="date"
                  value={formData.purchase_date}
                  onChange={(e) => setFormData({...formData, purchase_date: e.target.value})}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => isJumpstart ? router.push('/jumpstart/guide?mode=' + jumpstartMode) : router.push('/dashboard')}
          >
            {isJumpstart ? 'Back' : 'Cancel'}
          </Button>
          <Button
            type="submit"
            disabled={loading || ocrLoading}
            size={isJumpstart ? 'lg' : 'default'}
            className={isJumpstart ? 'px-8' : ''}
          >
            {loading ? 'Saving...' : isJumpstart ? 'Save & Continue' : 'Create Asset'}
          </Button>
        </div>
      </form>

      {/* Celebration Modal */}
      {isJumpstart && session && (
        <CelebrationModal
          isOpen={showCelebration}
          onClose={() => setShowCelebration(false)}
          itemName={formData.title}
          estimatedValue={parseFloat(formData.estimated_value) || 0}
          itemNumber={promptIndex + 1}
          totalItems={session.items_target}
          runningTotal={session.total_value}
          onContinue={handleCelebrationContinue}
        />
      )}

      {/* OCR Review Modal */}
      {ocrResult && (
        <OCRReviewModal
          isOpen={showOCRReview}
          onClose={() => setShowOCRReview(false)}
          ocrResult={ocrResult}
          imageUrl={ocrImageUrl}
          onAccept={handleOCRAccept}
          onReject={handleOCRReject}
        />
      )}
    </div>
  );
}

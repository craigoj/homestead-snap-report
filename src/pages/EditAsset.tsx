import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PropertyRoomSelector } from '@/components/PropertyRoomSelector';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft,
  Package, 
  DollarSign,
  Save,
  Brain,
  Zap,
  TrendingUp
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

export default function EditAsset() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [valuationLoading, setValuationLoading] = useState(false);
  const [valuationResult, setValuationResult] = useState<any>(null);
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

  useEffect(() => {
    if (id && user) {
      fetchAsset();
    }
  }, [id, user]);

  const fetchAsset = async () => {
    try {
      const { data: asset, error } = await supabase
        .from('assets')
        .select(`
          *,
          properties (id, name),
          rooms (id, name)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      setFormData({
        title: asset.title || '',
        description: asset.description || '',
        category: asset.category || '',
        brand: asset.brand || '',
        model: asset.model || '',
        serial_number: asset.serial_number || '',
        condition: asset.condition || 'good',
        estimated_value: asset.estimated_value?.toString() || '',
        purchase_date: asset.purchase_date || '',
        purchase_price: asset.purchase_price?.toString() || '',
        property_id: asset.property_id || '',
        room_id: asset.room_id || '',
      });
    } catch (error: any) {
      toast({
        title: "Error Loading Asset",
        description: error.message,
        variant: "destructive",
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getAIValuation = async () => {
    if (!formData.title || !formData.category || !formData.condition) {
      toast({
        title: "Missing Information",
        description: "Please fill in title, category, and condition before getting AI valuation.",
        variant: "destructive",
      });
      return;
    }

    setValuationLoading(true);
    try {
      // Get asset photos for the valuation
      const { data: photos } = await supabase
        .from('asset_photos')
        .select('file_path')
        .eq('asset_id', id)
        .eq('is_primary', true)
        .limit(1);

      const valuationData = {
        title: formData.title,
        description: formData.description,
        brand: formData.brand,
        model: formData.model,
        category: formData.category,
        condition: formData.condition,
        purchase_date: formData.purchase_date,
        purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : undefined,
        imageUrl: photos && photos[0] ? supabase.storage.from('asset-photos').getPublicUrl(photos[0].file_path).data.publicUrl : undefined
      };

      const { data: result, error } = await supabase.functions.invoke('valuation-estimate', {
        body: valuationData
      });

      if (error) throw error;

      setValuationResult(result);
      
      toast({
        title: "AI Valuation Complete",
        description: `Estimated value: $${result.estimated_value} (${result.confidence}% confidence)`,
      });

      // Log valuation request
      await supabase.rpc('log_audit_event', {
        p_event_type: 'asset_created', // Using existing event type
        p_entity_type: 'asset',
        p_entity_id: id,
        p_metadata: { 
          action: 'ai_valuation_update',
          estimated_value: result.estimated_value,
          confidence: result.confidence
        }
      });

    } catch (error: any) {
      console.error('AI valuation failed:', error);
      toast({
        title: "Valuation Failed",
        description: "Couldn't get AI valuation. Please try again or enter value manually.",
        variant: "destructive",
      });
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
      toast({
        title: "Valuation Applied",
        description: `Set estimated value to $${valuationResult.estimated_value}`,
      });
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

    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('assets')
        .update({
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
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Asset Updated",
        description: `${formData.title} has been updated successfully.`,
      });

      // Log asset update
      await supabase.rpc('log_audit_event', {
        p_event_type: 'asset_created', // Using existing event type for updates
        p_entity_type: 'asset', 
        p_entity_id: id,
        p_metadata: { 
          title: formData.title,
          category: formData.category,
          estimated_value: formData.estimated_value,
          action: 'updated'
        }
      });

      navigate(`/assets/${id}`);
      
    } catch (error: any) {
      toast({
        title: "Error Updating Asset",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48 mt-2" />
          </div>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/assets/${id}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Asset</h1>
          <p className="text-muted-foreground">
            Update asset information and details.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
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

          {/* Asset Details */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Details</CardTitle>
              <CardDescription>
                Update information about your asset. Fields marked with * are required.
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
                      value={formData.estimated_value}
                      onChange={(e) => setFormData({...formData, estimated_value: e.target.value})}
                      placeholder="0.00"
                      className="pl-10"
                    />
                  </div>
                  {valuationResult && (
                    <div className="p-3 bg-muted rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          <span className="font-medium">AI Valuation</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {valuationResult.confidence}% confidence
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Estimated Value:</span>
                          <span className="font-semibold">${valuationResult.estimated_value}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Range:</span>
                          <span>${valuationResult.value_range.min} - ${valuationResult.value_range.max}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{valuationResult.reasoning}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={acceptAIValuation}>
                          Accept Value
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setValuationResult(null)}>
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  )}
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
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate(`/assets/${id}`)}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
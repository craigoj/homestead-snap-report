import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  DollarSign,
  Calendar,
  Home,
  MapPin,
  Camera,
  FileText,
  ExternalLink
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Asset {
  id: string;
  title: string;
  description: string;
  category: string;
  brand: string;
  model: string;
  serial_number: string;
  condition: string;
  estimated_value: number;
  purchase_date: string;
  purchase_price: number;
  ocr_extracted: boolean;
  ocr_confidence: number;
  created_at: string;
  updated_at: string;
  properties: {
    id: string;
    name: string;
    address: string;
  };
  rooms: {
    id: string;
    name: string;
  } | null;
}

interface AssetPhoto {
  id: string;
  file_path: string;
  file_name: string;
  is_primary: boolean;
}

interface Receipt {
  id: string;
  file_path: string;
  file_name: string;
  created_at: string;
}

export default function AssetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [photos, setPhotos] = useState<AssetPhoto[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && user) {
      fetchAsset();
    }
  }, [id, user]);

  const fetchAsset = async () => {
    try {
      // Fetch asset details
      const { data: assetData, error: assetError } = await supabase
        .from('assets')
        .select(`
          *,
          properties (id, name, address),
          rooms (id, name)
        `)
        .eq('id', id)
        .single();

      if (assetError) throw assetError;

      // Fetch photos
      const { data: photosData, error: photosError } = await supabase
        .from('asset_photos')
        .select('*')
        .eq('asset_id', id)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: true });

      if (photosError) throw photosError;

      // Fetch receipts
      const { data: receiptsData, error: receiptsError } = await supabase
        .from('receipts')
        .select('*')
        .eq('asset_id', id)
        .order('created_at', { ascending: false });

      if (receiptsError) throw receiptsError;

      setAsset(assetData);
      setPhotos(photosData || []);
      setReceipts(receiptsData || []);
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

  const deleteAsset = async () => {
    if (!confirm('Are you sure you want to delete this asset? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Asset Deleted",
        description: "The asset has been removed from your inventory.",
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error Deleting Asset",
        description: error.message,
        variant: "destructive",
      });
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
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">Asset Not Found</h3>
        <p className="text-muted-foreground">The asset you're looking for doesn't exist.</p>
        <Button className="mt-4" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{asset.title}</h1>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Home className="h-4 w-4" />
              <span>{asset.properties.name}</span>
              {asset.rooms && (
                <>
                  <span>•</span>
                  <span>{asset.rooms.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/assets/${asset.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={deleteAsset} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photos */}
          {photos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="h-5 w-5" />
                  <span>Photos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                        <img
                          src={`https://hfiznpxdopjdwtuenxqf.supabase.co/storage/v1/object/public/asset-photos/${photo.file_path}`}
                          alt={`Asset photo`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to icon if image fails to load
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent && !parent.querySelector('.fallback-icon')) {
                              const icon = document.createElement('div');
                              icon.className = 'fallback-icon w-full h-full flex items-center justify-center absolute inset-0';
                              icon.innerHTML = '<svg class="h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                              parent.appendChild(icon);
                            }
                          }}
                        />
                      </div>
                      {photo.is_primary && (
                        <Badge className="absolute top-2 left-2" variant="secondary">
                          Primary
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {asset.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{asset.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Receipts */}
          {receipts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Receipts & Documents</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {receipts.map((receipt) => (
                    <div key={receipt.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{receipt.file_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Uploaded {new Date(receipt.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Asset Info */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Category</span>
                <Badge variant="secondary" className="capitalize">
                  {asset.category}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Condition</span>
                <Badge 
                  variant={asset.condition === 'excellent' ? 'default' : 
                         asset.condition === 'good' ? 'secondary' : 'outline'}
                  className="capitalize"
                >
                  {asset.condition}
                </Badge>
              </div>

              {asset.brand && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Brand</span>
                  <span className="text-sm font-medium">{asset.brand}</span>
                </div>
              )}

              {asset.model && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Model</span>
                  <span className="text-sm font-medium">{asset.model}</span>
                </div>
              )}

              {asset.serial_number && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Serial #</span>
                  <span className="text-sm font-medium font-mono">{asset.serial_number}</span>
                </div>
              )}

              <Separator />

              {asset.estimated_value && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Est. Value</span>
                  <span className="text-lg font-bold text-primary">
                    ${asset.estimated_value.toLocaleString()}
                  </span>
                </div>
              )}

              {asset.purchase_price && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Purchase Price</span>
                  <span className="text-sm font-medium">
                    ${asset.purchase_price.toLocaleString()}
                  </span>
                </div>
              )}

              {asset.purchase_date && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Purchase Date</span>
                  <span className="text-sm font-medium">
                    {new Date(asset.purchase_date).toLocaleDateString()}
                  </span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Added</span>
                <span className="text-sm font-medium">
                  {new Date(asset.created_at).toLocaleDateString()}
                </span>
              </div>

              {asset.ocr_extracted && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">OCR Extracted</span>
                  <div className="flex items-center space-x-1">
                    <Badge variant="outline" className="text-xs">
                      AI
                    </Badge>
                    {asset.ocr_confidence && (
                      <span className="text-xs text-muted-foreground">
                        ({Math.round(asset.ocr_confidence * 100)}%)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{asset.properties.name}</p>
                {asset.properties.address && (
                  <p className="text-sm text-muted-foreground">{asset.properties.address}</p>
                )}
              </div>
              {asset.rooms && (
                <div>
                  <p className="text-sm text-muted-foreground">Room</p>
                  <p className="font-medium">{asset.rooms.name}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
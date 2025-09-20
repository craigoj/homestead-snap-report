import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  DollarSign, 
  MapPin, 
  Calendar, 
  Camera,
  Eye,
  MoreHorizontal 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Asset {
  id: string;
  title: string;
  category: string;
  condition: string;
  estimated_value: number | null;
  created_at: string;
  properties: {
    name: string;
  };
  rooms: {
    name: string;
  } | null;
  asset_photos?: {
    file_path: string;
    is_primary: boolean;
  }[];
}

interface AssetCardProps {
  asset: Asset;
  className?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const AssetCard = ({ asset, className, onEdit, onDelete }: AssetCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const primaryPhoto = asset.asset_photos?.find(photo => photo.is_primary) || asset.asset_photos?.[0];
  const photoUrl = primaryPhoto 
    ? `https://hfiznpxdopjdwtuenxqf.supabase.co/storage/v1/object/public/asset-photos/${primaryPhoto.file_path}`
    : null;

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'default';
      case 'good': return 'secondary';
      case 'fair': return 'outline';
      case 'poor': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card className={`group hover:shadow-md transition-shadow ${className || ''}`}>
      <CardContent className="p-0">
        {/* Image */}
        <div className="aspect-[4/3] bg-muted rounded-t-lg overflow-hidden relative">
          {photoUrl && !imageError ? (
            <img
              src={photoUrl}
              alt={asset.title}
              className={`w-full h-full object-cover transition-opacity ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : null}
          
          {(!photoUrl || imageError || !imageLoaded) && (
            <div className="absolute inset-0 flex items-center justify-center">
              {photoUrl && !imageError ? (
                <div className="animate-pulse">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
              ) : (
                <Package className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
          )}

          {/* Photo count badge */}
          {asset.asset_photos && asset.asset_photos.length > 1 && (
            <Badge variant="secondary" className="absolute top-2 left-2 text-xs">
              <Camera className="h-3 w-3 mr-1" />
              {asset.asset_photos.length}
            </Badge>
          )}

          {/* Actions menu */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/assets/${asset.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Link>
                </DropdownMenuItem>
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(asset.id)}>
                    Edit Asset
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(asset.id)}
                    className="text-destructive"
                  >
                    Delete Asset
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title and Category */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-sm line-clamp-2 flex-1 mr-2">
                {asset.title}
              </h3>
              <Badge variant="outline" className="text-xs capitalize shrink-0">
                {asset.category}
              </Badge>
            </div>
            
            {/* Location */}
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1 shrink-0" />
              <span className="truncate">
                {asset.properties.name}
                {asset.rooms && ` • ${asset.rooms.name}`}
              </span>
            </div>
          </div>

          {/* Value and Condition */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm font-semibold">
                {asset.estimated_value 
                  ? `$${asset.estimated_value.toLocaleString()}` 
                  : 'N/A'
                }
              </span>
            </div>
            <Badge variant={getConditionColor(asset.condition)} className="text-xs capitalize">
              {asset.condition}
            </Badge>
          </div>

          {/* Date */}
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Added {new Date(asset.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { AssetCard } from '@/components/AssetCard';
import { PhotoUpload } from '@/components/PhotoUpload';
import {
  ArrowLeft,
  Edit3,
  Plus,
  Package,
  MapPin,
  Calendar,
  DollarSign,
  Home,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';

interface Property {
  id: string;
  name: string;
  address: string;
  description: string;
  created_at: string;
  asset_count?: number;
  total_value?: number;
  room_count?: number;
}

interface Room {
  id: string;
  name: string;
  description: string;
  property_id: string;
  created_at: string;
  asset_count?: number;
}

interface Asset {
  id: string;
  title: string;
  category: string;
  condition: string;
  estimated_value: number;
  room_id?: string | null;
  property_id: string;
  created_at: string;
  asset_photos: Array<{ file_path: string; is_primary: boolean }>;
  properties?: { name: string };
  rooms?: { name: string };
}

export default function PropertyDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user } = useAuth();

  const [property, setProperty] = useState<Property | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isEditPropertyOpen, setIsEditPropertyOpen] = useState(false);

  // Form states
  const [roomForm, setRoomForm] = useState({ name: '', description: '' });
  const [propertyForm, setPropertyForm] = useState({ name: '', address: '', description: '' });

  useEffect(() => {
    if (id) {
      fetchPropertyData();
    }
  }, [id, user]);

  const fetchPropertyData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch property details
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (propertyError) throw propertyError;

      // Fetch property stats
      const { data: statsData } = await supabase
        .from('assets')
        .select('id, estimated_value')
        .eq('property_id', id)
        .eq('user_id', user.id);

      const assetCount = statsData?.length || 0;
      const totalValue = statsData?.reduce((sum, asset) => sum + (asset.estimated_value || 0), 0) || 0;

      // Fetch rooms with asset counts
      const { data: roomsData } = await supabase
        .from('rooms')
        .select(`
          *,
          assets:assets(count)
        `)
        .eq('property_id', id);

      const roomsWithCounts = roomsData?.map(room => ({
        ...room,
        asset_count: room.assets?.[0]?.count || 0
      })) || [];

      // Fetch assets for this property
      const { data: assetsData } = await supabase
        .from('assets')
        .select(`
          *,
          asset_photos (file_path, is_primary)
        `)
        .eq('property_id', id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setProperty({
        ...propertyData,
        asset_count: assetCount,
        total_value: totalValue,
        room_count: roomsWithCounts.length
      });
      setRooms(roomsWithCounts);
      setAssets(assetsData || []);
      setPropertyForm({
        name: propertyData.name,
        address: propertyData.address || '',
        description: propertyData.description || ''
      });

    } catch (error) {
      console.error('Error fetching property data:', error);
      toast.error('Failed to load property data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;

    try {
      const { error } = await supabase
        .from('rooms')
        .insert([{
          name: roomForm.name,
          description: roomForm.description,
          property_id: id
        }]);

      if (error) throw error;

      toast.success('Room added successfully');

      setRoomForm({ name: '', description: '' });
      setIsAddRoomOpen(false);
      fetchPropertyData();
    } catch (error) {
      console.error('Error adding room:', error);
      toast.error('Failed to add room');
    }
  };

  const handleEditProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;

    try {
      const { error } = await supabase
        .from('properties')
        .update({
          name: propertyForm.name,
          address: propertyForm.address,
          description: propertyForm.description
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Property updated successfully');

      setIsEditPropertyOpen(false);
      fetchPropertyData();
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Failed to update property');
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId);

      if (error) throw error;

      toast.success('Room deleted successfully');

      fetchPropertyData();
    } catch (error) {
      console.error('Error deleting room:', error);
      toast.error('Failed to delete room');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <Home className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">Property not found</h3>
        <p className="mt-2 text-muted-foreground">
          The property you're looking for doesn't exist or you don't have access to it.
        </p>
        <Button asChild className="mt-4">
          <Link href="/properties">Back to Properties</Link>
        </Button>
      </div>
    );
  }

  const getRoomAssets = (roomId: string) => assets.filter(asset => asset.room_id === roomId);
  const getUnassignedAssets = () => assets.filter(asset => !asset.room_id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/properties">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{property.name}</h1>
            {property.address && (
              <p className="text-muted-foreground flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {property.address}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isEditPropertyOpen} onOpenChange={setIsEditPropertyOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Property
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Property</DialogTitle>
                <DialogDescription>Update your property information</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditProperty} className="space-y-4">
                <div>
                  <Label htmlFor="name">Property Name</Label>
                  <Input
                    id="name"
                    value={propertyForm.name}
                    onChange={(e) => setPropertyForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={propertyForm.address}
                    onChange={(e) => setPropertyForm(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={propertyForm.description}
                    onChange={(e) => setPropertyForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditPropertyOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Property</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Assets</CardDescription>
            <CardTitle className="text-2xl">{property.asset_count}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-muted-foreground">
              <Package className="h-4 w-4 mr-1" />
              <span className="text-sm">Items tracked</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Value</CardDescription>
            <CardTitle className="text-2xl">
              ${(property.total_value || 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-muted-foreground">
              <DollarSign className="h-4 w-4 mr-1" />
              <span className="text-sm">Estimated worth</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Rooms</CardDescription>
            <CardTitle className="text-2xl">{property.room_count}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-muted-foreground">
              <Home className="h-4 w-4 mr-1" />
              <span className="text-sm">Spaces defined</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Created</CardDescription>
            <CardTitle className="text-lg">
              {new Date(property.created_at).toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="text-sm">Property added</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Property Description */}
      {property.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{property.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rooms">Rooms ({rooms.length})</TabsTrigger>
          <TabsTrigger value="assets">All Assets ({property.asset_count})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Recent Assets */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Assets</CardTitle>
                <CardDescription>Latest assets added to this property</CardDescription>
              </div>
              <Button asChild size="sm">
                <Link href={`/assets/add?property=${id}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Asset
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {assets.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No assets yet</h3>
                  <p className="mt-2 text-muted-foreground">
                    Start adding assets to track your belongings in this property.
                  </p>
                  <Button asChild className="mt-4">
                    <Link href={`/assets/add?property=${id}`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Asset
                    </Link>
                  </Button>
                </div>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {assets.slice(0, 6).map((asset) => (
                      <AssetCard key={asset.id} asset={{
                        ...asset,
                        asset_photos: asset.asset_photos || [],
                        properties: asset.properties || { name: 'Unknown Property' },
                        rooms: asset.rooms || null
                      }} />
                    ))}
                  </div>
              )}
            </CardContent>
          </Card>

          {/* Room Summary */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Room Summary</CardTitle>
                <CardDescription>Assets organized by room</CardDescription>
              </div>
              <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Room
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Room</DialogTitle>
                    <DialogDescription>Create a new room in {property.name}</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddRoom} className="space-y-4">
                    <div>
                      <Label htmlFor="room-name">Room Name</Label>
                      <Input
                        id="room-name"
                        value={roomForm.name}
                        onChange={(e) => setRoomForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Living Room, Master Bedroom"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="room-description">Description</Label>
                      <Textarea
                        id="room-description"
                        value={roomForm.description}
                        onChange={(e) => setRoomForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Optional description of the room"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsAddRoomOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Add Room</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {rooms.length === 0 ? (
                <div className="text-center py-8">
                  <Home className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No rooms defined</h3>
                  <p className="mt-2 text-muted-foreground">
                    Create rooms to better organize your assets within this property.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rooms.map((room) => (
                    <Card key={room.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{room.name}</CardTitle>
                          <Badge variant="secondary">
                            {getRoomAssets(room.id).length} assets
                          </Badge>
                        </div>
                        {room.description && (
                          <CardDescription>{room.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Created {new Date(room.created_at).toLocaleDateString()}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRoom(room.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms" className="space-y-6">
          {rooms.map((room) => (
            <Card key={room.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>{room.name}</span>
                      <Badge variant="secondary">
                        {getRoomAssets(room.id).length} assets
                      </Badge>
                    </CardTitle>
                    {room.description && (
                      <CardDescription>{room.description}</CardDescription>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteRoom(room.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {getRoomAssets(room.id).length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">No assets in this room yet</p>
                    <Button asChild size="sm" className="mt-2">
                      <Link href={`/assets/add?property=${id}&room=${room.id}`}>
                        Add Asset to {room.name}
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getRoomAssets(room.id).map((asset) => (
                      <AssetCard key={asset.id} asset={{
                        ...asset,
                        asset_photos: asset.asset_photos || [],
                        properties: asset.properties || { name: 'Unknown Property' },
                        rooms: asset.rooms || null
                      }} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Unassigned Assets */}
          {getUnassignedAssets().length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Unassigned Assets</span>
                  <Badge variant="outline">
                    {getUnassignedAssets().length} assets
                  </Badge>
                </CardTitle>
                <CardDescription>Assets not assigned to any specific room</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getUnassignedAssets().map((asset) => (
                    <AssetCard key={asset.id} asset={{
                      ...asset,
                      asset_photos: asset.asset_photos || [],
                      properties: asset.properties || { name: 'Unknown Property' },
                      rooms: asset.rooms || null
                    }} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="assets" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>All Assets in {property.name}</CardTitle>
                <CardDescription>Complete inventory for this property</CardDescription>
              </div>
              <Button asChild>
                <Link href={`/assets/add?property=${id}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Asset
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {assets.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No assets found</h3>
                  <p className="mt-2 text-muted-foreground">
                    Start building your inventory by adding your first asset.
                  </p>
                  <Button asChild className="mt-4">
                    <Link href={`/assets/add?property=${id}`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Asset
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {assets.map((asset) => (
                    <AssetCard key={asset.id} asset={{
                      ...asset,
                      asset_photos: asset.asset_photos || [],
                      properties: asset.properties || { name: 'Unknown Property' },
                      rooms: asset.rooms || null
                    }} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

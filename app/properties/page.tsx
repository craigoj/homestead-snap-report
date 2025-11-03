'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import {
  Home,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Package,
  DoorOpen
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Property {
  id: string;
  name: string;
  address: string;
  description: string;
  created_at: string;
  asset_count?: number;
  room_count?: number;
}

interface Room {
  id: string;
  name: string;
  description: string;
  property_id: string;
}

export default function Properties() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [rooms, setRooms] = useState<Record<string, Room[]>>({});
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
  });
  const [roomFormData, setRoomFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user]);

  const fetchProperties = async () => {
    try {
      // Fetch properties with counts
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select(`
          id,
          name,
          address,
          description,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (propertiesError) throw propertiesError;

      // Fetch asset counts for each property
      const propertiesWithCounts = await Promise.all(
        (propertiesData || []).map(async (property) => {
          const [assetResult, roomResult] = await Promise.all([
            supabase
              .from('assets')
              .select('id', { count: 'exact', head: true })
              .eq('property_id', property.id),
            supabase
              .from('rooms')
              .select('id', { count: 'exact', head: true })
              .eq('property_id', property.id)
          ]);

          return {
            ...property,
            asset_count: assetResult.count || 0,
            room_count: roomResult.count || 0,
          };
        })
      );

      // Fetch all rooms
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .in('property_id', propertiesData?.map(p => p.id) || []);

      if (roomsError) throw roomsError;

      // Group rooms by property
      const roomsByProperty = (roomsData || []).reduce((acc, room) => {
        if (!acc[room.property_id]) acc[room.property_id] = [];
        acc[room.property_id].push(room);
        return acc;
      }, {} as Record<string, Room[]>);

      setProperties(propertiesWithCounts);
      setRooms(roomsByProperty);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter a property name');
      return;
    }

    try {
      const { error } = await supabase
        .from('properties')
        .insert([
          {
            user_id: user?.id,
            name: formData.name.trim(),
            address: formData.address.trim() || null,
            description: formData.description.trim() || null,
          }
        ]);

      if (error) throw error;

      toast.success('Property created successfully');

      setDialogOpen(false);
      setFormData({ name: '', address: '', description: '' });
      fetchProperties();

      // Log the event
      await supabase.rpc('log_audit_event', {
        p_event_type: 'property_created',
        p_entity_type: 'property',
        p_metadata: { name: formData.name }
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create property');
    }
  };

  const handleRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomFormData.name.trim() || !selectedProperty) {
      toast.error('Please enter a room name');
      return;
    }

    try {
      const { error } = await supabase
        .from('rooms')
        .insert([
          {
            property_id: selectedProperty,
            name: roomFormData.name.trim(),
            description: roomFormData.description.trim() || null,
          }
        ]);

      if (error) throw error;

      toast.success('Room added successfully');

      setRoomDialogOpen(false);
      setRoomFormData({ name: '', description: '' });
      setSelectedProperty(null);
      fetchProperties();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add room');
    }
  };

  const deleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property? This will also delete all associated assets and rooms.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;

      toast.success('Property deleted successfully');

      fetchProperties();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete property');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">
            Manage your properties and organize assets by location.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
              <DialogDescription>
                Create a new property to organize your assets by location.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Property Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Main Home, Vacation House"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address (Optional)</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="123 Main St, City, State"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Additional details about this property..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Property</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <Card>
          <CardHeader className="text-center">
            <Home className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle>No Properties Yet</CardTitle>
            <CardDescription>
              Create your first property to start organizing your assets by location.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Property
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Card key={property.id} className="relative group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Link href={`/properties/${property.id}`} className="flex items-center space-x-2 hover:opacity-75 transition-opacity">
                    <Home className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{property.name}</CardTitle>
                  </Link>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-destructive"
                      onClick={() => deleteProperty(property.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {property.address && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.address}
                  </div>
                )}
                {property.description && (
                  <CardDescription className="text-sm">
                    {property.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <Package className="h-3 w-3" />
                      <span>{property.asset_count} assets</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <DoorOpen className="h-3 w-3" />
                      <span>{property.room_count} rooms</span>
                    </Badge>
                  </div>
                </div>

                {/* Rooms List */}
                {rooms[property.id] && rooms[property.id].length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Rooms:</h4>
                    <div className="flex flex-wrap gap-1">
                      {rooms[property.id].map((room) => (
                        <Badge key={room.id} variant="outline" className="text-xs">
                          {room.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedProperty(property.id);
                      setRoomDialogOpen(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Room
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Room Dialog */}
      <Dialog open={roomDialogOpen} onOpenChange={setRoomDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Room</DialogTitle>
            <DialogDescription>
              Add a new room to organize assets within this property.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRoomSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="room-name">Room Name</Label>
              <Input
                id="room-name"
                value={roomFormData.name}
                onChange={(e) => setRoomFormData({...roomFormData, name: e.target.value})}
                placeholder="e.g., Living Room, Kitchen, Bedroom"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="room-description">Description (Optional)</Label>
              <Textarea
                id="room-description"
                value={roomFormData.description}
                onChange={(e) => setRoomFormData({...roomFormData, description: e.target.value})}
                placeholder="Additional details about this room..."
                rows={2}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setRoomDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Room</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

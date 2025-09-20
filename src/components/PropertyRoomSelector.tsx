import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Home, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Property {
  id: string;
  name: string;
  address: string;
}

interface Room {
  id: string;
  name: string;
  property_id: string;
}

interface PropertyRoomSelectorProps {
  selectedPropertyId: string;
  selectedRoomId: string;
  onPropertyChange: (propertyId: string) => void;
  onRoomChange: (roomId: string) => void;
  allowEmpty?: boolean;
}

export const PropertyRoomSelector = ({
  selectedPropertyId,
  selectedRoomId,
  onPropertyChange,
  onRoomChange,
  allowEmpty = false
}: PropertyRoomSelectorProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user]);

  useEffect(() => {
    if (selectedPropertyId) {
      fetchRooms(selectedPropertyId);
    } else {
      setRooms([]);
      if (selectedRoomId) {
        onRoomChange('');
      }
    }
  }, [selectedPropertyId]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, name, address')
        .order('name');

      if (error) throw error;
      setProperties(data || []);
    } catch (error: any) {
      toast({
        title: "Error Loading Properties",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async (propertyId: string) => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('id, name, property_id')
        .eq('property_id', propertyId)
        .order('name');

      if (error) throw error;
      setRooms(data || []);
    } catch (error: any) {
      toast({
        title: "Error Loading Rooms",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handlePropertyChange = (value: string) => {
    // Convert "all" back to empty string for backwards compatibility
    const propertyId = value === "all" ? "" : value;
    onPropertyChange(propertyId);
    onRoomChange(''); // Clear room selection when property changes
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Property</Label>
          <div className="h-10 bg-muted rounded-md animate-pulse"></div>
        </div>
        <div className="space-y-2">
          <Label>Room (Optional)</Label>
          <div className="h-10 bg-muted rounded-md animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Property Selection */}
      <div className="space-y-2">
        <Label htmlFor="property">Property {!allowEmpty && '*'}</Label>
        {properties.length === 0 ? (
          <div className="p-4 border rounded-lg text-center">
            <Home className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-3">
              No properties found. Create your first property to continue.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/properties')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          </div>
        ) : (
          <Select value={selectedPropertyId} onValueChange={handlePropertyChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a property" />
            </SelectTrigger>
            <SelectContent>
              {allowEmpty && (
                <SelectItem value="all">All Properties</SelectItem>
              )}
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  <div>
                    <div className="font-medium">{property.name}</div>
                    {property.address && (
                      <div className="text-xs text-muted-foreground">{property.address}</div>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Room Selection */}
      {selectedPropertyId && (
        <div className="space-y-2">
          <Label htmlFor="room">Room (Optional)</Label>
          <Select value={selectedRoomId} onValueChange={(value) => {
            // Convert "all" and "none" back to empty string for backwards compatibility
            const roomId = (value === "all" || value === "none") ? "" : value;
            onRoomChange(roomId);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select a room (optional)" />
            </SelectTrigger>
            <SelectContent>
              {allowEmpty && (
                <SelectItem value="all">All Rooms</SelectItem>
              )}
              <SelectItem value="none">No specific room</SelectItem>
              {rooms.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {rooms.length === 0 && selectedPropertyId && (
            <p className="text-xs text-muted-foreground">
              No rooms created for this property yet. 
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs"
                onClick={() => navigate('/properties')}
              >
                Add rooms in Properties
              </Button>
            </p>
          )}
        </div>
      )}
    </div>
  );
};
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { AssetCard } from '@/components/AssetCard';
import {
  Package,
  Download,
  Upload,
  Trash2,
  Edit3,
  Filter,
  CheckSquare,
  Square,
  FileDown,
  FileUp,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface Asset {
  id: string;
  title: string;
  category: string;
  condition: string;
  estimated_value: number;
  property_id: string;
  room_id?: string | null;
  created_at: string;
  properties?: { name: string };
  rooms?: { name: string };
  asset_photos?: Array<{ file_path: string; is_primary: boolean }>;
}

interface Property {
  id: string;
  name: string;
}

interface Room {
  id: string;
  name: string;
  property_id: string;
}

export default function BulkAssetOperations() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Filters
  const [filterProperty, setFilterProperty] = useState<string>('');
  const [filterRoom, setFilterRoom] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Bulk update form
  const [bulkUpdateData, setBulkUpdateData] = useState({
    property_id: 'no-change',
    room_id: 'no-change',
    category: 'no-change',
    condition: 'no-change',
    estimated_value: ''
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch assets with property and room info
      const { data: assetsData, error: assetsError } = await supabase
        .from('assets')
        .select(`
          *,
          properties (name),
          rooms (name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (assetsError) throw assetsError;

      // Fetch properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('id, name')
        .eq('user_id', user.id);

      if (propertiesError) throw propertiesError;

      // Fetch rooms
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('id, name, property_id');

      if (roomsError) throw roomsError;

      setAssets(assetsData || []);
      setProperties(propertiesData || []);
      setRooms(roomsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesProperty = !filterProperty || filterProperty === "all" || asset.property_id === filterProperty;
    const matchesRoom = !filterRoom || filterRoom === "all" || asset.room_id === filterRoom;
    const matchesCategory = !filterCategory || filterCategory === "all" || asset.category === filterCategory;
    const matchesSearch = !searchTerm || 
      asset.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesProperty && matchesRoom && matchesCategory && matchesSearch;
  });

  const availableRooms = filterProperty 
    ? rooms.filter(room => room.property_id === filterProperty)
    : rooms;

  const categories = ['electronics', 'furniture', 'appliances', 'jewelry', 'artwork', 'clothing', 'documents', 'other'];
  const conditions = ['excellent', 'good', 'fair', 'poor'];

  const handleSelectAsset = (assetId: string, checked: boolean) => {
    const newSelected = new Set(selectedAssets);
    if (checked) {
      newSelected.add(assetId);
    } else {
      newSelected.delete(assetId);
    }
    setSelectedAssets(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAssets(new Set(filteredAssets.map(asset => asset.id)));
    } else {
      setSelectedAssets(new Set());
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedAssets.size === 0) {
      toast({
        title: 'No Selection',
        description: 'Please select assets to update',
        variant: 'destructive'
      });
      return;
    }

    // Prepare update data (only include non-empty values)
    const updateData: any = {};
    if (bulkUpdateData.property_id && bulkUpdateData.property_id !== "no-change") updateData.property_id = bulkUpdateData.property_id;
    if (bulkUpdateData.room_id && bulkUpdateData.room_id !== "no-change") updateData.room_id = bulkUpdateData.room_id;
    if (bulkUpdateData.category && bulkUpdateData.category !== "no-change") updateData.category = bulkUpdateData.category;
    if (bulkUpdateData.condition && bulkUpdateData.condition !== "no-change") updateData.condition = bulkUpdateData.condition;
    if (bulkUpdateData.estimated_value) updateData.estimated_value = parseFloat(bulkUpdateData.estimated_value);

    if (Object.keys(updateData).length === 0) {
      toast({
        title: 'No Changes',
        description: 'Please select fields to update',
        variant: 'destructive'
      });
      return;
    }

    try {
      setOperationLoading(true);
      setProgress(0);

      const assetIds = Array.from(selectedAssets);
      const batchSize = 10;
      let completed = 0;

      // Process in batches
      for (let i = 0; i < assetIds.length; i += batchSize) {
        const batch = assetIds.slice(i, i + batchSize);
        
        const { error } = await supabase
          .from('assets')
          .update(updateData)
          .in('id', batch)
          .eq('user_id', user.id);

        if (error) throw error;

        completed += batch.length;
        setProgress((completed / assetIds.length) * 100);

        // Small delay to prevent overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      toast({
        title: 'Success',
        description: `Updated ${selectedAssets.size} assets successfully`
      });

      // Reset form and selection
      setBulkUpdateData({
        property_id: 'no-change',
        room_id: 'no-change',
        category: 'no-change',
        condition: 'no-change',
        estimated_value: ''
      });
      setSelectedAssets(new Set());
      fetchData();

    } catch (error) {
      console.error('Error updating assets:', error);
      toast({
        title: 'Error',
        description: 'Failed to update assets',
        variant: 'destructive'
      });
    } finally {
      setOperationLoading(false);
      setProgress(0);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedAssets.size === 0) {
      toast({
        title: 'No Selection',
        description: 'Please select assets to delete',
        variant: 'destructive'
      });
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedAssets.size} assets? This action cannot be undone.`)) {
      return;
    }

    try {
      setOperationLoading(true);
      setProgress(0);

      // First delete associated photos
      const assetIds = Array.from(selectedAssets);
      
      const { error: photosError } = await supabase
        .from('asset_photos')
        .delete()
        .in('asset_id', assetIds);

      if (photosError) throw photosError;

      // Then delete receipts
      const { error: receiptsError } = await supabase
        .from('receipts')
        .delete()
        .in('asset_id', assetIds);

      if (receiptsError) throw receiptsError;

      setProgress(50);

      // Finally delete assets
      const { error: assetsError } = await supabase
        .from('assets')
        .delete()
        .in('id', assetIds)
        .eq('user_id', user.id);

      if (assetsError) throw assetsError;

      setProgress(100);

      toast({
        title: 'Success',
        description: `Deleted ${selectedAssets.size} assets successfully`
      });

      setSelectedAssets(new Set());
      fetchData();

    } catch (error) {
      console.error('Error deleting assets:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete assets',
        variant: 'destructive'
      });
    } finally {
      setOperationLoading(false);
      setProgress(0);
    }
  };

  const exportToCSV = () => {
    if (filteredAssets.length === 0) {
      toast({
        title: 'No Data',
        description: 'No assets to export',
        variant: 'destructive'
      });
      return;
    }

    const csvData = filteredAssets.map(asset => ({
      Title: asset.title,
      Category: asset.category,
      Condition: asset.condition,
      'Estimated Value': asset.estimated_value || 0,
      Property: asset.properties?.name || '',
      Room: asset.rooms?.name || '',
      'Created Date': new Date(asset.created_at).toLocaleDateString()
    }));

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `assets-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Success',
      description: 'Assets exported successfully'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Bulk Asset Operations</h1>
        <p className="text-muted-foreground">
          Manage multiple assets at once with bulk operations, import/export, and advanced filtering.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Assets</CardDescription>
            <CardTitle className="text-2xl">{assets.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Filtered Results</CardDescription>
            <CardTitle className="text-2xl">{filteredAssets.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Selected Assets</CardDescription>
            <CardTitle className="text-2xl">{selectedAssets.size}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Value</CardDescription>
            <CardTitle className="text-2xl">
              ${assets.reduce((sum, asset) => sum + (asset.estimated_value || 0), 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="bulk-operations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="bulk-operations">Bulk Operations</TabsTrigger>
          <TabsTrigger value="import-export">Import/Export</TabsTrigger>
        </TabsList>

        <TabsContent value="bulk-operations" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filters & Search</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Search</Label>
                  <Input
                    placeholder="Search assets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Property</Label>
                  <Select value={filterProperty} onValueChange={setFilterProperty}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Properties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Properties</SelectItem>
                      {properties.map(property => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Room</Label>
                  <Select value={filterRoom} onValueChange={setFilterRoom}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Rooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Rooms</SelectItem>
                      {availableRooms.map(room => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckSquare className="h-5 w-5" />
                    <span>Bulk Actions</span>
                  </CardTitle>
                  <CardDescription>
                    {selectedAssets.size} asset{selectedAssets.size !== 1 ? 's' : ''} selected
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectAll(selectedAssets.size !== filteredAssets.length)}
                  >
                    {selectedAssets.size === filteredAssets.length ? (
                      <>
                        <Square className="h-4 w-4 mr-2" />
                        Deselect All
                      </>
                    ) : (
                      <>
                        <CheckSquare className="h-4 w-4 mr-2" />
                        Select All ({filteredAssets.length})
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Bulk Update Form */}
              <div>
                <h4 className="text-sm font-medium mb-3">Bulk Update Selected Assets</h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <Label>Move to Property</Label>
                     <Select
                       value={bulkUpdateData.property_id}
                       onValueChange={(value) => setBulkUpdateData(prev => ({ 
                         ...prev, 
                         property_id: value, 
                         room_id: 'no-change' 
                       }))}
                     >
                      <SelectTrigger>
                        <SelectValue placeholder="No change" />
                      </SelectTrigger>
                      <SelectContent>
                         <SelectItem value="no-change">No change</SelectItem>
                        {properties.map(property => (
                          <SelectItem key={property.id} value={property.id}>
                            {property.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Move to Room</Label>
                    <Select
                      value={bulkUpdateData.room_id}
                      onValueChange={(value) => setBulkUpdateData(prev => ({ ...prev, room_id: value }))}
                      disabled={!bulkUpdateData.property_id || bulkUpdateData.property_id === "no-change"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="No change" />
                      </SelectTrigger>
                      <SelectContent>
                         <SelectItem value="no-change">No change</SelectItem>
                        {rooms
                          .filter(room => room.property_id === bulkUpdateData.property_id)
                          .map(room => (
                            <SelectItem key={room.id} value={room.id}>
                              {room.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Set Category</Label>
                    <Select
                      value={bulkUpdateData.category}
                      onValueChange={(value) => setBulkUpdateData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="No change" />
                      </SelectTrigger>
                      <SelectContent>
                         <SelectItem value="no-change">No change</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Set Condition</Label>
                    <Select
                      value={bulkUpdateData.condition}
                      onValueChange={(value) => setBulkUpdateData(prev => ({ ...prev, condition: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="No change" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-change">No change</SelectItem>
                        {conditions.map(condition => (
                          <SelectItem key={condition} value={condition}>
                            {condition.charAt(0).toUpperCase() + condition.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Set Value ($)</Label>
                    <Input
                      type="number"
                      placeholder="No change"
                      value={bulkUpdateData.estimated_value}
                      onChange={(e) => setBulkUpdateData(prev => ({ ...prev, estimated_value: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleBulkUpdate}
                    disabled={selectedAssets.size === 0 || operationLoading}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Update Selected ({selectedAssets.size})
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleBulkDelete}
                    disabled={selectedAssets.size === 0 || operationLoading}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected ({selectedAssets.size})
                  </Button>
                </div>
                {operationLoading && (
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <Progress value={progress} className="w-32" />
                    <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Asset Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Selection ({filteredAssets.length} assets)</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredAssets.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No assets found</h3>
                  <p className="mt-2 text-muted-foreground">
                    Try adjusting your filters or search terms.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAssets.map((asset) => (
                    <div key={asset.id} className="relative">
                      <div className="absolute top-2 left-2 z-10">
                        <Checkbox
                          checked={selectedAssets.has(asset.id)}
                          onCheckedChange={(checked) => handleSelectAsset(asset.id, checked as boolean)}
                          className="bg-background border-2"
                        />
                      </div>
                      <AssetCard
                        asset={{
                          ...asset,
                          asset_photos: asset.asset_photos || [],
                          properties: asset.properties || { name: 'Unknown Property' },
                          rooms: asset.rooms || null
                        }}
                        className={selectedAssets.has(asset.id) ? 'ring-2 ring-primary' : ''}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import-export" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileDown className="h-5 w-5" />
                  <span>Export Assets</span>
                </CardTitle>
                <CardDescription>
                  Download your asset inventory as a CSV file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Export will include all filtered assets ({filteredAssets.length} items)
                  </AlertDescription>
                </Alert>
                <Button onClick={exportToCSV} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export to CSV
                </Button>
              </CardContent>
            </Card>

            {/* Import */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileUp className="h-5 w-5" />
                  <span>Import Assets</span>
                </CardTitle>
                <CardDescription>
                  Upload a CSV file to bulk import assets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Import feature coming soon. For now, use the manual asset creation process.
                  </AlertDescription>
                </Alert>
                <Button disabled className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Import from CSV (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
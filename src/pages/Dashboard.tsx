import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { 
  Home, 
  Package, 
  Plus, 
  Search, 
  DollarSign,
  TrendingUp,
  Camera,
  Filter
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Asset {
  id: string;
  title: string;
  category: string;
  condition: string;
  estimated_value: number;
  created_at: string;
  properties: {
    name: string;
  };
  rooms: {
    name: string;
  } | null;
}

interface DashboardStats {
  totalAssets: number;
  totalValue: number;
  properties: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ totalAssets: 0, totalValue: 0, properties: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch recent assets
      const { data: assetsData, error: assetsError } = await supabase
        .from('assets')
        .select(`
          id,
          title,
          category,
          condition,
          estimated_value,
          created_at,
          properties (name),
          rooms (name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (assetsError) throw assetsError;

      // Fetch stats
      const { data: statsData, error: statsError } = await supabase
        .from('assets')
        .select('estimated_value');

      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('id');

      if (statsError || propertiesError) throw statsError || propertiesError;

      const totalValue = statsData?.reduce((sum, asset) => sum + (asset.estimated_value || 0), 0) || 0;

      setAssets(assetsData || []);
      setStats({
        totalAssets: statsData?.length || 0,
        totalValue,
        properties: propertiesData?.length || 0,
      });
    } catch (error: any) {
      toast({
        title: "Error Loading Dashboard",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || asset.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
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
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your inventory.
          </p>
        </div>
        <Button asChild>
          <Link to="/assets/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Asset
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssets}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.properties}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalAssets > 0 ? Math.round(stats.totalValue / stats.totalAssets).toLocaleString() : '0'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {stats.totalAssets === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              You haven't added any assets yet. Start by creating your first property and adding assets.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link to="/properties">
                <Home className="mr-2 h-4 w-4" />
                Add Property
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/assets/add">
                <Camera className="mr-2 h-4 w-4" />
                Scan First Asset
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Assets */}
      {stats.totalAssets > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Assets</CardTitle>
            <CardDescription>
              Your most recently added inventory items
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="appliances">Appliances</SelectItem>
                  <SelectItem value="jewelry">Jewelry</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="tools">Tools</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Assets List */}
            <div className="space-y-4">
              {filteredAssets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm || categoryFilter !== 'all' 
                    ? 'No assets match your search criteria'
                    : 'No assets found'
                  }
                </div>
              ) : (
                filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{asset.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {asset.properties.name}
                          {asset.rooms && ` • ${asset.rooms.name}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="secondary" className="capitalize">
                        {asset.category}
                      </Badge>
                      <Badge 
                        variant={asset.condition === 'excellent' ? 'default' : 
                               asset.condition === 'good' ? 'secondary' : 'outline'}
                        className="capitalize"
                      >
                        {asset.condition}
                      </Badge>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${asset.estimated_value?.toLocaleString() || 'N/A'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(asset.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {filteredAssets.length > 0 && (
              <div className="mt-6 text-center">
                <Button variant="outline" asChild>
                  <Link to="/dashboard">View All Assets</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
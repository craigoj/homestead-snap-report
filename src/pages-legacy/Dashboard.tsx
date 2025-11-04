import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { safeLocalStorage } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';
import { AssetCard } from '@/components/AssetCard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { DeadlineWarning } from '@/components/DeadlineWarning';
import { JumpstartModeSelector } from '@/components/jumpstart';
import { 
  Home, 
  Package, 
  Plus, 
  Search, 
  DollarSign,
  TrendingUp,
  Camera,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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

interface DashboardStats {
  totalAssets: number;
  totalValue: number;
  properties: number;
}

interface LossEvent {
  id: string;
  event_type: string;
  event_date: string;
  deadline_60_days: string;
  status: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ totalAssets: 0, totalValue: 0, properties: 0 });
  const [lossEvents, setLossEvents] = useState<LossEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'title' | 'estimated_value'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 12;
  const [showJumpstart, setShowJumpstart] = useState(true);

  // Check if user previously skipped jumpstart
  useEffect(() => {
    const skipped = safeLocalStorage.getItem('jumpstart_skipped');
    if (skipped === 'true') {
      setShowJumpstart(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchDashboardData();
      fetchLossEvents();
    }
  }, [user, searchTerm, categoryFilter, sortBy, sortOrder, currentPage]);

  const fetchDashboardData = async () => {
    try {
      // Build query with filters
      let query = supabase
        .from('assets')
        .select(`
          id,
          title,
          category,
          condition,
          estimated_value,
          created_at,
          properties (name),
          rooms (name),
          asset_photos (file_path, is_primary)
        `, { count: 'exact' });

      // Apply filters
      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }
      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter as any);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);

      const { data: assetsData, error: assetsError, count } = await query;

      if (assetsError) throw assetsError;

      setAssets(assetsData || []);
      setTotalCount(count || 0);

      // Fetch stats (separate query for performance)
      const { data: statsData, error: statsError } = await supabase
        .from('assets')
        .select('estimated_value');

      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('id');

      if (statsError || propertiesError) throw statsError || propertiesError;

      const totalValue = statsData?.reduce((sum, asset) => sum + (asset.estimated_value || 0), 0) || 0;

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

  const fetchLossEvents = async () => {
    try {
      const today = new Date();
      const { data, error } = await supabase
        .from('loss_events')
        .select('*')
        .eq('status', 'active')
        .gte('deadline_60_days', today.toISOString().split('T')[0]);

      if (error) throw error;
      setLossEvents(data || []);
    } catch (error: any) {
      console.error('Error loading loss events:', error);
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleSort = (field: typeof sortBy) => {
    if (field === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

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
    <ErrorBoundary>
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

      {/* Deadline Warnings */}
      {lossEvents.map((event) => {
        const daysRemaining = Math.ceil((new Date(event.deadline_60_days).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return (
          <DeadlineWarning
            key={event.id}
            daysRemaining={daysRemaining}
            eventId={event.id}
            eventType={event.event_type}
            eventDate={event.event_date}
          />
        );
      })}

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

      {/* Smart Scan Jumpstart or Empty State */}
          {stats.totalAssets === 0 && showJumpstart && (
            <JumpstartModeSelector
              onModeSelect={(mode) => {
                navigate(`/jumpstart/guide?mode=${mode}`);
              }}
              onSkip={() => {
                setShowJumpstart(false);
                safeLocalStorage.setItem('jumpstart_skipped', 'true');
              }}
            />
          )}

      {/* Fallback Empty State */}
      {stats.totalAssets === 0 && !showJumpstart && (
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              You haven't added any assets yet. Start by creating your first property and adding assets.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => {
                safeLocalStorage.removeItem('jumpstart_skipped');
                navigate('/jumpstart');
              }}
              className="flex items-center"
            >
              <Camera className="mr-2 h-4 w-4" />
              Try Jumpstart Guide
            </Button>
            <Button asChild variant="outline">
              <Link to="/properties">
                <Home className="mr-2 h-4 w-4" />
                Add Property
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/assets/add">
                <Plus className="mr-2 h-4 w-4" />
                Add Asset Manually
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Assets Inventory */}
      {stats.totalAssets > 0 && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle>Asset Inventory</CardTitle>
                <CardDescription>
                  {totalCount} total assets • Page {currentPage} of {totalPages}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSort('title')}
                  className="text-xs"
                >
                  <ArrowUpDown className="mr-1 h-3 w-3" />
                  Name {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSort('estimated_value')}
                  className="text-xs"
                >
                  <ArrowUpDown className="mr-1 h-3 w-3" />
                  Value {sortBy === 'estimated_value' && (sortOrder === 'asc' ? '↑' : '↓')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSort('created_at')}
                  className="text-xs"
                >
                  <ArrowUpDown className="mr-1 h-3 w-3" />
                  Date {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={handleCategoryFilter}>
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

            {/* Assets Grid */}
            {assets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm || categoryFilter !== 'all' 
                  ? 'No assets match your search criteria'
                  : 'No assets found'
                }
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {assets.map((asset) => (
                    <AssetCard 
                      key={asset.id} 
                      asset={asset}
                      onEdit={(id) => console.log('Edit asset:', id)}
                      onDelete={(id) => console.log('Delete asset:', id)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        const isCurrentPage = page === currentPage;
                        return (
                          <Button
                            key={page}
                            variant={isCurrentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        );
                      })}
                      {totalPages > 5 && (
                        <>
                          <span className="text-muted-foreground">...</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(totalPages)}
                            className="w-8 h-8 p-0"
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
      </div>
    </ErrorBoundary>
  );
}
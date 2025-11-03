'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { safeLocalStorage } from '@/lib/storage'
import { toast } from 'sonner'
import { AssetCard } from '@/components/AssetCard'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { DeadlineWarning } from '@/components/DeadlineWarning'
import { JumpstartModeSelector } from '@/components/jumpstart'
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
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface Asset {
  id: string
  title: string
  category: string
  condition: string
  estimated_value: number | null
  created_at: string
  properties: {
    name: string
  }
  rooms: {
    name: string
  } | null
  asset_photos?: {
    file_path: string
    is_primary: boolean
  }[]
}

interface DashboardStats {
  totalAssets: number
  totalValue: number
  properties: number
}

interface LossEvent {
  id: string
  event_type: string
  event_date: string
  deadline_60_days: string
  status: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [assets, setAssets] = useState<Asset[]>([])
  const [stats, setStats] = useState<DashboardStats>({ totalAssets: 0, totalValue: 0, properties: 0 })
  const [lossEvents, setLossEvents] = useState<LossEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'created_at' | 'title' | 'estimated_value'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const itemsPerPage = 12
  const [showJumpstart, setShowJumpstart] = useState(true)

  // Check if user previously skipped jumpstart
  useEffect(() => {
    const skipped = safeLocalStorage.getItem('jumpstart_skipped')
    if (skipped === 'true') {
      setShowJumpstart(false)
    }
  }, [])

  useEffect(() => {
    if (user) {
      setLoading(true)
      fetchDashboardData()
      fetchLossEvents()
    }
  }, [user, searchTerm, categoryFilter, sortBy, sortOrder, currentPage])

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
        `, { count: 'exact' })

      // Apply filters
      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`)
      }
      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter as any)
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })

      // Apply pagination
      const from = (currentPage - 1) * itemsPerPage
      const to = from + itemsPerPage - 1
      query = query.range(from, to)

      const { data: assetsData, error: assetsError, count } = await query

      if (assetsError) throw assetsError

      setAssets(assetsData || [])
      setTotalCount(count || 0)

      // Fetch stats (separate query for performance)
      const { data: statsData, error: statsError } = await supabase
        .from('assets')
        .select('estimated_value')

      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('id')

      if (statsError || propertiesError) throw statsError || propertiesError

      const totalValue = statsData?.reduce((sum, asset) => sum + (asset.estimated_value || 0), 0) || 0

      setStats({
        totalAssets: statsData?.length || 0,
        totalValue,
        properties: propertiesData?.length || 0,
      })
    } catch (error: any) {
      toast.error(error.message, {
        description: 'Error Loading Dashboard',
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchLossEvents = async () => {
    try {
      const today = new Date()
      const { data, error } = await supabase
        .from('loss_events')
        .select('*')
        .eq('status', 'active')
        .gte('deadline_60_days', today.toISOString().split('T')[0])

      if (error) throw error
      setLossEvents(data || [])
    } catch (error: any) {
      console.error('Error loading loss events:', error)
    }
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  const handleSort = (field: typeof sortBy) => {
    if (field === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
    setCurrentPage(1)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value)
    setCurrentPage(1)
  }

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
    )
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
            <Link href="/assets/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Asset
            </Link>
          </Button>
        </div>

        {/* Deadline Warnings */}
        {lossEvents.map((event) => {
          const daysRemaining = Math.ceil((new Date(event.deadline_60_days).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          return (
            <DeadlineWarning
              key={event.id}
              eventType={event.event_type}
              eventDate={event.event_date}
              daysRemaining={daysRemaining}
            />
          )
        })}

        {/* Jumpstart Mode Selector (show if no assets) */}
        {showJumpstart && stats.totalAssets === 0 && (
          <JumpstartModeSelector onSkip={() => {
            safeLocalStorage.setItem('jumpstart_skipped', 'true')
            setShowJumpstart(false)
          }} />
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAssets}</div>
              <p className="text-xs text-muted-foreground">
                Items in your inventory
              </p>
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
              <p className="text-xs text-muted-foreground">
                Estimated replacement value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Properties</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.properties}</div>
              <p className="text-xs text-muted-foreground">
                Tracked locations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coverage</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalAssets > 0 ? '100%' : '0%'}
              </div>
              <p className="text-xs text-muted-foreground">
                Items documented
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <Select value={categoryFilter} onValueChange={handleCategoryFilter}>
              <SelectTrigger className="w-[180px]">
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

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort('created_at')}
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Date {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort('estimated_value')}
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Value {sortBy === 'estimated_value' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Button>
          </div>
        </div>

        {/* Assets Grid */}
        {assets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Camera className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No assets yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm || categoryFilter !== 'all'
                  ? 'No assets match your filters. Try adjusting your search.'
                  : 'Start building your inventory by adding your first asset.'}
              </p>
              <Button asChild>
                <Link href="/assets/add">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Asset
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {assets.map((asset) => (
                <AssetCard key={asset.id} asset={asset} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} assets
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ErrorBoundary>
  )
}

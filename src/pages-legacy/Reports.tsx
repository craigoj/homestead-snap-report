import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PropertyRoomSelector } from '@/components/PropertyRoomSelector';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { 
  FileText,
  Download,
  Plus,
  ExternalLink,
  Calendar,
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Report {
  id: string;
  title: string;
  report_type: string;
  status: string;
  total_value: number;
  asset_count: number;
  share_token: string;
  expires_at: string;
  created_at: string;
  properties: {
    name: string;
  } | null;
}

interface ReportForm {
  title: string;
  report_type: string;
  property_id: string;
  room_id: string;
}

export default function Reports() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState<ReportForm>({
    title: '',
    report_type: 'pdf',
    property_id: '',
    room_id: '',
  });

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('claim_reports')
        .select(`
          *,
          properties (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error: any) {
      toast({
        title: "Error Loading Reports",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a report title.",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    
    try {
      // Calculate report data
      let assetQuery = supabase
        .from('assets')
        .select('id, estimated_value');
      
      if (formData.property_id) {
        assetQuery = assetQuery.eq('property_id', formData.property_id);
      }
      
      if (formData.room_id) {
        assetQuery = assetQuery.eq('room_id', formData.room_id);
      }

      const { data: assets, error: assetsError } = await assetQuery;
      if (assetsError) throw assetsError;

      const rawTotal = (assets || []).reduce((sum: number, asset: any) => {
        const vRaw = asset?.estimated_value as unknown;
        const vNum = typeof vRaw === 'string' ? Number(vRaw) : (typeof vRaw === 'number' ? vRaw : 0);
        return sum + (Number.isFinite(vNum) && vNum > 0 ? vNum : 0);
      }, 0);
      const totalValue = Math.min(rawTotal, 999999999);
      const assetCount = assets?.length || 0;

      // Generate share token
      const shareToken = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Set expiry to 7 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // Create report record
      const { data: report, error: reportError } = await supabase
        .from('claim_reports')
        .insert([
          {
            user_id: user?.id,
            property_id: formData.property_id || null,
            title: formData.title.trim(),
            report_type: formData.report_type,
            share_token: shareToken,
            expires_at: expiresAt.toISOString(),
            status: 'generating',
            total_value: totalValue,
            asset_count: assetCount,
          }
        ])
        .select()
        .single();

      if (reportError) throw reportError;

      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Update report status
      const { error: updateError } = await supabase
        .from('claim_reports')
        .update({ 
          status: 'ready',
          file_path: `reports/${report.id}.pdf`
        })
        .eq('id', report.id);

      if (updateError) throw updateError;

      toast({
        title: "Report Generated",
        description: `${formData.title} has been created successfully.`,
      });

      // Log export event
      await supabase.rpc('log_audit_event', {
        p_event_type: 'export_generated',
        p_entity_type: 'report',
        p_entity_id: report.id,
        p_metadata: { 
          report_type: formData.report_type,
          total_value: totalValue,
          asset_count: assetCount
        }
      });

      setDialogOpen(false);
      setFormData({ title: '', report_type: 'pdf', property_id: '', room_id: '' });
      fetchReports();
      
    } catch (error: any) {
      toast({
        title: "Error Generating Report",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generating':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'ready':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'expired':
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generating':
        return 'bg-amber-100 text-amber-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const copyShareLink = (shareToken: string) => {
    const shareUrl = `${window.location.origin}/shared/${shareToken}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied",
      description: "Share link has been copied to clipboard.",
    });
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
        
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
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
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and manage claim-ready reports for insurance purposes.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Generate New Report</DialogTitle>
              <DialogDescription>
                Create a comprehensive report of your assets for insurance claims or documentation.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={generateReport} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Report Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Home Insurance Claim 2024"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="report_type">Report Format</Label>
                  <Select value={formData.report_type} onValueChange={(value) => 
                    setFormData({...formData, report_type: value})
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Report</SelectItem>
                      <SelectItem value="csv">CSV Export</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Scope (Optional)</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Select a specific property or room to include. Leave blank to include all assets.
                </p>
                <PropertyRoomSelector
                  selectedPropertyId={formData.property_id}
                  selectedRoomId={formData.room_id}
                  onPropertyChange={(propertyId) => 
                    setFormData(prev => ({ ...prev, property_id: propertyId, room_id: '' }))
                  }
                  onRoomChange={(roomId) => 
                    setFormData(prev => ({ ...prev, room_id: roomId }))
                  }
                  allowEmpty={true}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={generating}>
                  {generating ? 'Generating...' : 'Generate Report'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <Card>
          <CardHeader className="text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle>No Reports Yet</CardTitle>
            <CardDescription>
              Generate your first report to export your asset inventory for insurance claims.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Generate First Report
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span>{report.title}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Created {new Date(report.created_at).toLocaleDateString()}</span>
                      </div>
                      {report.properties && (
                        <div className="flex items-center space-x-1">
                          <Package className="h-4 w-4" />
                          <span>{report.properties.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="capitalize">
                      {report.report_type.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(report.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(report.status)}
                        <span className="capitalize">{report.status}</span>
                      </div>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Value</p>
                      <p className="font-semibold">${report.total_value.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Assets</p>
                      <p className="font-semibold">{report.asset_count}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Expires</p>
                      <p className="font-semibold">
                        {new Date(report.expires_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 justify-end">
                    {report.status === 'ready' && (
                      <>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyShareLink(report.share_token)}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
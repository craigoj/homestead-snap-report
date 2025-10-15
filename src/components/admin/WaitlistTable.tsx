import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Search, Download } from 'lucide-react';

interface WaitlistTableProps {
  entries: any[];
  onUpdate: () => void;
}

export const WaitlistTable = ({ entries, onUpdate }: WaitlistTableProps) => {
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = entry.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRowClick = (entry: any) => {
    setSelectedEntry(entry);
    setStatus(entry.status || 'pending');
    setNotes(entry.notes || '');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedEntry) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('waitlist')
        .update({
          status,
          notes,
          notified: status === 'notified' || status === 'active'
        })
        .eq('id', selectedEntry.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Waitlist entry updated successfully"
      });
      
      onUpdate();
      setModalOpen(false);
    } catch (error) {
      console.error('Error updating waitlist entry:', error);
      toast({
        title: "Error",
        description: "Failed to update waitlist entry",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Position', 'Email', 'Priority Tier', 'Status', 'Joined'];
    const rows = filteredEntries.map(e => [
      e.position,
      e.email,
      e.priority_tier,
      e.status,
      format(new Date(e.joined_at), 'yyyy-MM-dd HH:mm')
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waitlist-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'notified': return 'secondary';
      case 'active': return 'default';
      case 'inactive': return 'outline';
      default: return 'default';
    }
  };

  const getPriorityColor = (tier: string) => {
    switch (tier) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'standard': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="notified">Notified</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={exportToCSV} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Priority Tier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Notified</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No waitlist entries found
                </TableCell>
              </TableRow>
            ) : (
              filteredEntries.map((entry) => (
                <TableRow
                  key={entry.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(entry)}
                >
                  <TableCell className="font-bold">#{entry.position}</TableCell>
                  <TableCell>{entry.email}</TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(entry.priority_tier)}>
                      {entry.priority_tier}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(entry.status)}>
                      {entry.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(entry.joined_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    {entry.notified ? '✓' : '✗'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Waitlist Entry</DialogTitle>
          </DialogHeader>

          {selectedEntry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <Label className="text-xs text-muted-foreground">Position</Label>
                  <p className="font-bold">#{selectedEntry.position}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedEntry.email}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Priority</Label>
                  <Badge variant={getPriorityColor(selectedEntry.priority_tier)}>
                    {selectedEntry.priority_tier}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Joined</Label>
                  <p className="text-sm">{format(new Date(selectedEntry.joined_at), 'PPp')}</p>
                </div>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="notified">Notified</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this entry..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AssessmentDetailModal } from './AssessmentDetailModal';
import { format } from 'date-fns';
import { Search, Download } from 'lucide-react';

interface AssessmentsTableProps {
  assessments: any[];
  onUpdate: () => void;
}

export const AssessmentsTable = ({ assessments, onUpdate }: AssessmentsTableProps) => {
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch = 
      assessment.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = segmentFilter === 'all' || assessment.segment === segmentFilter;
    const matchesStatus = statusFilter === 'all' || assessment.status === statusFilter;
    return matchesSearch && matchesSegment && matchesStatus;
  });

  const handleRowClick = (assessment: any) => {
    setSelectedAssessment(assessment);
    setModalOpen(true);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Score', 'Segment', 'Priority', 'Status', 'Submitted'];
    const rows = filteredAssessments.map(a => [
      a.full_name,
      a.email,
      a.phone || '',
      a.score,
      a.segment,
      a.priority_level,
      a.status,
      format(new Date(a.submitted_at), 'yyyy-MM-dd HH:mm')
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assessments-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'critical': return 'destructive';
      case 'high-risk': return 'destructive';
      case 'moderate': return 'default';
      case 'prepared': return 'default';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'default';
      case 'contacted': return 'secondary';
      case 'qualified': return 'default';
      case 'converted': return 'default';
      case 'closed': return 'outline';
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
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={segmentFilter} onValueChange={setSegmentFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by segment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Segments</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high-risk">High Risk</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="prepared">Prepared</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
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
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Segment</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssessments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No assessments found
                </TableCell>
              </TableRow>
            ) : (
              filteredAssessments.map((assessment) => (
                <TableRow
                  key={assessment.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(assessment)}
                >
                  <TableCell className="font-medium">{assessment.full_name}</TableCell>
                  <TableCell>{assessment.email}</TableCell>
                  <TableCell>
                    <span className="font-semibold">{assessment.score}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getSegmentColor(assessment.segment)}>
                      {assessment.segment}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge>Level {assessment.priority_level}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(assessment.status)}>
                      {assessment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(assessment.submitted_at), 'MMM dd, yyyy')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AssessmentDetailModal
        assessment={selectedAssessment}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onUpdate={onUpdate}
      />
    </div>
  );
};

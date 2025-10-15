import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { assessmentQuestions } from '@/lib/assessmentQuestions';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface AssessmentDetailModalProps {
  assessment: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export const AssessmentDetailModal = ({ assessment, open, onOpenChange, onUpdate }: AssessmentDetailModalProps) => {
  const [status, setStatus] = useState(assessment?.status || 'new');
  const [notes, setNotes] = useState(assessment?.admin_notes || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!assessment) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('assessment_submissions')
        .update({
          status,
          admin_notes: notes,
          contacted_at: status === 'contacted' ? new Date().toISOString() : assessment.contacted_at,
          contacted_by: status === 'contacted' ? (await supabase.auth.getUser()).data.user?.id : assessment.contacted_by
        })
        .eq('id', assessment.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Assessment updated successfully"
      });
      
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating assessment:', error);
      toast({
        title: "Error",
        description: "Failed to update assessment",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (!assessment) return null;

  const responses = assessment.responses || {};
  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'critical': return 'destructive';
      case 'high-risk': return 'destructive';
      case 'moderate': return 'default';
      case 'prepared': return 'default';
      default: return 'default';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assessment Details</DialogTitle>
          <DialogDescription>
            Full submission from {assessment.full_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <Label className="text-xs text-muted-foreground">Name</Label>
              <p className="font-medium">{assessment.full_name}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Email</Label>
              <p className="font-medium">{assessment.email}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Phone</Label>
              <p className="font-medium">{assessment.phone || 'Not provided'}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Location</Label>
              <p className="font-medium">{assessment.location || 'Not provided'}</p>
            </div>
          </div>

          {/* Score & Segment */}
          <div className="flex items-center gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Score</Label>
              <p className="text-3xl font-bold">{assessment.score}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Segment</Label>
              <Badge variant={getSegmentColor(assessment.segment)}>
                {assessment.segment}
              </Badge>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Priority</Label>
              <Badge>Level {assessment.priority_level}</Badge>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Submitted</Label>
              <p className="text-sm">{format(new Date(assessment.submitted_at), 'PPpp')}</p>
            </div>
          </div>

          {/* Questions & Answers */}
          <div className="space-y-4">
            <h3 className="font-semibold">Responses</h3>
            {assessmentQuestions.map((question) => (
              <div key={question.id} className="border-l-2 border-primary pl-4">
                <p className="text-sm font-medium mb-1">{question.question}</p>
                <p className="text-sm text-muted-foreground">
                  {responses[question.id] || 'Not answered'}
                </p>
              </div>
            ))}
          </div>

          {/* Admin Controls */}
          <div className="space-y-4 pt-4 border-t">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Admin Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this lead..."
                rows={4}
              />
            </div>

            {assessment.contacted_at && (
              <p className="text-xs text-muted-foreground">
                Last contacted: {format(new Date(assessment.contacted_at), 'PPpp')}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

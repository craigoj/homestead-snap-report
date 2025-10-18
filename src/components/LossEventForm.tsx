import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';

interface LossEventFormProps {
  onSuccess: (eventId: string) => void;
  onCancel: () => void;
}

export const LossEventForm = ({ onSuccess, onCancel }: LossEventFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    event_type: '',
    event_date: '',
    discovery_date: '',
    description: '',
    police_report_number: '',
    fire_department_report: '',
    estimated_total_loss: '',
    property_id: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('loss_events')
        .insert({
          user_id: user.id,
          event_type: formData.event_type,
          event_date: formData.event_date,
          discovery_date: formData.discovery_date,
          description: formData.description,
          police_report_number: formData.police_report_number || null,
          fire_department_report: formData.fire_department_report || null,
          estimated_total_loss: formData.estimated_total_loss ? parseFloat(formData.estimated_total_loss) : null,
          property_id: formData.property_id || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Loss event created',
        description: `Your 60-day filing deadline is ${new Date(data.deadline_60_days).toLocaleDateString()}`,
      });
      onSuccess(data.id);
    } catch (error: any) {
      console.error('Error creating loss event:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">Important: 60-Day Filing Deadline</p>
              <p className="text-sm text-muted-foreground mt-1">
                Most insurance policies require claims to be filed within 60 days of discovering the loss.
                We'll track your deadline and send reminders.
              </p>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="event_type">Event Type *</Label>
          <Select value={formData.event_type} onValueChange={(value) => setFormData({ ...formData, event_type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fire">Fire</SelectItem>
              <SelectItem value="theft">Theft</SelectItem>
              <SelectItem value="flood">Flood</SelectItem>
              <SelectItem value="water_damage">Water Damage</SelectItem>
              <SelectItem value="storm">Storm</SelectItem>
              <SelectItem value="vandalism">Vandalism</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="event_date">Date of Event *</Label>
          <Input
            id="event_date"
            type="date"
            value={formData.event_date}
            onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="discovery_date">Date Discovered *</Label>
          <Input
            id="discovery_date"
            type="date"
            value={formData.discovery_date}
            onChange={(e) => setFormData({ ...formData, discovery_date: e.target.value })}
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Filing deadline is calculated from this date
          </p>
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe what happened..."
            rows={4}
            required
          />
        </div>

        <div>
          <Label htmlFor="police_report_number">Police Report Number</Label>
          <Input
            id="police_report_number"
            value={formData.police_report_number}
            onChange={(e) => setFormData({ ...formData, police_report_number: e.target.value })}
            placeholder="Optional"
          />
        </div>

        <div>
          <Label htmlFor="fire_department_report">Fire Department Report</Label>
          <Input
            id="fire_department_report"
            value={formData.fire_department_report}
            onChange={(e) => setFormData({ ...formData, fire_department_report: e.target.value })}
            placeholder="Optional"
          />
        </div>

        <div>
          <Label htmlFor="estimated_total_loss">Estimated Total Loss</Label>
          <Input
            id="estimated_total_loss"
            type="number"
            step="0.01"
            value={formData.estimated_total_loss}
            onChange={(e) => setFormData({ ...formData, estimated_total_loss: e.target.value })}
            placeholder="$0.00"
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Loss Event'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

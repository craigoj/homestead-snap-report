import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WaitlistTable } from '@/components/admin/WaitlistTable';

export default function WaitlistManager() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const fetchWaitlist = async () => {
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching waitlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Waitlist Management</h1>
        <p className="text-muted-foreground">
          Manage and track waitlist entries
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading waitlist...</div>
      ) : (
        <WaitlistTable entries={entries} onUpdate={fetchWaitlist} />
      )}
    </div>
  );
}

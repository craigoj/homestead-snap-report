'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { AssessmentsTable } from '@/components/admin/AssessmentsTable';

export default function AssessmentsManager() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const { data, error } = await supabase
        .from('assessment_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Assessment Submissions</h1>
        <p className="text-muted-foreground">
          View and manage all quiz submissions
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading assessments...</div>
      ) : (
        <AssessmentsTable assessments={assessments} onUpdate={fetchAssessments} />
      )}
    </div>
  );
}

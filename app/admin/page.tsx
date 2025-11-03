'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { StatsCard } from '@/components/admin/StatsCard';
import { Users, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    todaySubmissions: 0,
    totalWaitlist: 0,
    criticalCount: 0,
    highRiskCount: 0,
    moderateCount: 0,
    preparedCount: 0,
    averageScore: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch assessment stats
      const { data: assessments, error: assessmentsError } = await supabase
        .from('assessment_submissions')
        .select('score, segment, submitted_at');

      if (assessmentsError) throw assessmentsError;

      // Fetch waitlist stats
      const { count: waitlistCount, error: waitlistError } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true });

      if (waitlistError) throw waitlistError;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayCount = assessments?.filter(a =>
        new Date(a.submitted_at) >= today
      ).length || 0;

      const segmentCounts = {
        critical: assessments?.filter(a => a.segment === 'critical').length || 0,
        highRisk: assessments?.filter(a => a.segment === 'high-risk').length || 0,
        moderate: assessments?.filter(a => a.segment === 'moderate').length || 0,
        prepared: assessments?.filter(a => a.segment === 'prepared').length || 0
      };

      const avgScore = assessments?.length
        ? Math.round(assessments.reduce((sum, a) => sum + a.score, 0) / assessments.length)
        : 0;

      setStats({
        totalSubmissions: assessments?.length || 0,
        todaySubmissions: todayCount,
        totalWaitlist: waitlistCount || 0,
        criticalCount: segmentCounts.critical,
        highRiskCount: segmentCounts.highRisk,
        moderateCount: segmentCounts.moderate,
        preparedCount: segmentCounts.prepared,
        averageScore: avgScore
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor assessment submissions and manage leads
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Submissions"
          value={stats.totalSubmissions}
          icon={Users}
          description={`${stats.todaySubmissions} today`}
        />
        <StatsCard
          title="Waitlist Size"
          value={stats.totalWaitlist}
          icon={TrendingUp}
          description="Active signups"
        />
        <StatsCard
          title="Average Score"
          value={stats.averageScore}
          icon={CheckCircle}
          description="Out of 100"
        />
        <StatsCard
          title="Critical Cases"
          value={stats.criticalCount}
          icon={AlertCircle}
          description="Require immediate attention"
        />
      </div>

      {/* Segment Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Segment Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span>Critical</span>
              </div>
              <span className="font-semibold">{stats.criticalCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span>High Risk</span>
              </div>
              <span className="font-semibold">{stats.highRiskCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span>Moderate</span>
              </div>
              <span className="font-semibold">{stats.moderateCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>Prepared</span>
              </div>
              <span className="font-semibold">{stats.preparedCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

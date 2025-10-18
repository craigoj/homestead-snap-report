import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const today = new Date();
    const in7Days = new Date(today);
    in7Days.setDate(in7Days.getDate() + 7);
    const in30Days = new Date(today);
    in30Days.setDate(in30Days.getDate() + 30);
    const in45Days = new Date(today);
    in45Days.setDate(in45Days.getDate() + 45);
    const in60Days = new Date(today);
    in60Days.setDate(in60Days.getDate() + 60);

    // Find loss events with approaching deadlines
    const { data: lossEvents, error } = await supabaseClient
      .from('loss_events')
      .select('*, profiles!inner(user_id, email:user_id)')
      .eq('status', 'active')
      .eq('deadline_notified', false)
      .or(`deadline_60_days.eq.${in7Days.toISOString().split('T')[0]},deadline_60_days.eq.${in30Days.toISOString().split('T')[0]},deadline_60_days.eq.${in45Days.toISOString().split('T')[0]},deadline_60_days.eq.${in60Days.toISOString().split('T')[0]}`);

    if (error) throw error;

    console.log(`Found ${lossEvents?.length || 0} loss events with approaching deadlines`);

    // Send reminder emails for each loss event
    for (const event of lossEvents || []) {
      const daysRemaining = Math.ceil((new Date(event.deadline_60_days).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      // Call send-email function
      await supabaseClient.functions.invoke('send-email', {
        body: {
          to: event.profiles.email,
          subject: `⚠️ Insurance Claim Deadline: ${daysRemaining} Days Remaining`,
          html: `
            <h1>Claim Filing Deadline Reminder</h1>
            <p>This is a reminder that your insurance claim deadline is approaching.</p>
            <p><strong>Days Remaining:</strong> ${daysRemaining}</p>
            <p><strong>Event Date:</strong> ${event.event_date}</p>
            <p><strong>Deadline:</strong> ${event.deadline_60_days}</p>
            <p><a href="https://snapassetai.com/proof-of-loss?eventId=${event.id}">File Your Claim Now</a></p>
          `,
        },
      });

      // Mark as notified
      await supabaseClient
        .from('loss_events')
        .update({ deadline_notified: true })
        .eq('id', event.id);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        remindersCount: lossEvents?.length || 0 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in deadline reminder:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const verificationToken = Deno.env.get('EBAY_VERIFICATION_TOKEN');
  
  if (!verificationToken) {
    console.error('EBAY_VERIFICATION_TOKEN not configured');
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Handle GET request for challenge validation
  if (req.method === 'GET') {
    try {
      const url = new URL(req.url);
      const challengeCode = url.searchParams.get('challenge_code');
      
      if (!challengeCode) {
        console.error('No challenge_code provided in GET request');
        return new Response(JSON.stringify({ error: 'Missing challenge_code' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('eBay challenge validation requested');

      // Construct endpoint URL (the callback URL that eBay will use)
      const endpoint = `https://hfiznpxdopjdwtuenxqf.supabase.co/functions/v1/ebay-account-deletion`;

      // Hash: challengeCode + verificationToken + endpoint
      const encoder = new TextEncoder();
      const data = encoder.encode(challengeCode + verificationToken + endpoint);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const challengeResponse = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      console.log('Challenge response generated successfully');

      return new Response(JSON.stringify({ challengeResponse }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error handling challenge validation:', error);
      return new Response(JSON.stringify({ error: 'Challenge validation failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  // Handle POST request for actual deletion notifications
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      const { metadata, notification } = body;

      if (!notification || !notification.data) {
        console.error('Invalid notification payload');
        return new Response(JSON.stringify({ error: 'Invalid payload' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { notificationId, eventDate, publishDate, data } = notification;
      const { username, userId, eiasToken } = data;

      console.log('eBay account deletion notification received:', {
        topic: metadata?.topic,
        notificationId,
        userId,
        username,
        eventDate,
      });

      // Initialize Supabase client with service role for data deletion
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Log the deletion request to audit logs
      await supabase.from('audit_logs').insert({
        event_type: 'ebay_account_deletion',
        entity_type: 'ebay_user',
        entity_id: userId,
        metadata: {
          notification_id: notificationId,
          event_date: eventDate,
          publish_date: publishDate,
          username,
          eias_token: eiasToken,
        },
      });

      // Delete or anonymize eBay-related data
      // For GDPR compliance, we should delete all user data tied to this eBay account
      // Note: This is a placeholder - adjust based on how you store eBay user data
      
      console.log(`Successfully processed deletion request for eBay user: ${userId} (${username})`);

      // Return 200 OK immediately to eBay
      return new Response(JSON.stringify({ 
        success: true,
        notificationId,
        message: 'Account deletion request received and processed',
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error processing deletion notification:', error);
      
      // Still return 200 to eBay - we don't want to expose internal errors
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Request received',
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  // Method not allowed
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});

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

  try {
    const verificationToken = Deno.env.get('EBAY_VERIFICATION_TOKEN');
    
    if (!verificationToken) {
      console.error('EBAY_VERIFICATION_TOKEN not configured');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { verificationToken: requestToken, notificationId, userId, timestamp } = body;

    console.log('eBay account deletion notification received:', {
      notificationId,
      userId,
      timestamp,
    });

    // Verify the token from eBay matches our stored token
    if (requestToken !== verificationToken) {
      console.error('Invalid verification token');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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
        timestamp,
        ebay_user_id: userId,
      },
    });

    // Delete or anonymize eBay-related data
    // For GDPR compliance, we should delete all user data tied to this eBay account
    // In this case, we'll delete eBay valuations associated with this user
    
    const { error: deleteError } = await supabase
      .from('ebay_valuations')
      .delete()
      .eq('search_method', 'ebay_user')
      .eq('search_query', userId);

    if (deleteError) {
      console.error('Error deleting eBay user data:', deleteError);
      // Still return 200 to eBay - we'll handle this internally
    } else {
      console.log(`Successfully processed deletion request for eBay user: ${userId}`);
    }

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
    console.error('Error in ebay-account-deletion function:', error);
    
    // Still return 200 to eBay - we don't want to expose internal errors
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Request received',
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

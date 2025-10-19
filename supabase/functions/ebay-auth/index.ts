import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    console.log('eBay auth request received');
    
    // Retrieve eBay credentials from environment
    const clientId = Deno.env.get('EBAY_APP_ID');
    const clientSecret = Deno.env.get('EBAY_CERT_ID');
    const environment = Deno.env.get('EBAY_ENVIRONMENT') || 'SANDBOX';
    
    if (!clientId || !clientSecret) {
      console.error('Missing eBay credentials');
      throw new Error('eBay credentials not configured. Please add EBAY_APP_ID and EBAY_CERT_ID environment variables.');
    }

    console.log(`Using eBay ${environment} environment`);
    
    // Base64 encode credentials for Authorization header
    const credentials = btoa(`${clientId}:${clientSecret}`);
    
    // Determine API endpoint based on environment
    const baseUrl = environment === 'PRODUCTION' 
      ? 'https://api.ebay.com' 
      : 'https://api.sandbox.ebay.com';
    
    console.log('Requesting OAuth token from eBay...');
    
    // Make OAuth token request
    const response = await fetch(
      `${baseUrl}/identity/v1/oauth2/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          scope: 'https://api.ebay.com/oauth/api_scope'
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('eBay OAuth failed:', response.status, error);
      throw new Error(`eBay OAuth failed: ${response.status} - ${error}`);
    }

    const data = await response.json();
    console.log('OAuth token retrieved successfully');
    
    // Return enhanced response with expiration timestamp
    return new Response(
      JSON.stringify({
        access_token: data.access_token,
        expires_in: data.expires_in,
        token_type: data.token_type,
        expires_at: Date.now() + (data.expires_in * 1000)
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('eBay auth error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to authenticate with eBay API'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

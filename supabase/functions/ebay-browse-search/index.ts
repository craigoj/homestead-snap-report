import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// eBay category mapping (SnapAssetAI → eBay)
const CATEGORY_MAPPING: Record<string, string> = {
  electronics: '293',      // Consumer Electronics
  appliances: '20625',     // Major Appliances
  furniture: '3197',       // Furniture
  jewelry: '281',          // Jewelry & Watches
  clothing: '11450',       // Clothing, Shoes & Accessories
  art: '550',              // Art
  books: '267',            // Books
  tools: '631',            // Hand Tools
  sports: '888',           // Sporting Goods
  other: '1'               // Everything Else
};

interface SearchRequest {
  searchQuery: string;
  category?: string;
  condition?: string;
  upc?: string;
  epid?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { searchQuery, category, condition, upc, epid }: SearchRequest = await req.json();
    
    if (!searchQuery && !upc && !epid) {
      throw new Error('searchQuery, upc, or epid is required');
    }

    console.log('eBay search request:', { searchQuery, category, condition, upc, epid });

    // Get OAuth token from ebay-auth function
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    const authResponse = await fetch(
      `${supabaseUrl}/functions/v1/ebay-auth`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!authResponse.ok) {
      throw new Error('Failed to get eBay auth token');
    }
    
    const { access_token } = await authResponse.json();
    console.log('eBay OAuth token retrieved');
    
    // Build search URL
    const environment = Deno.env.get('EBAY_ENVIRONMENT') || 'SANDBOX';
    const baseUrl = environment === 'PRODUCTION' 
      ? 'https://api.ebay.com' 
      : 'https://api.sandbox.ebay.com';
    
    const params = new URLSearchParams();
    
    // Priority: UPC > EPID > searchQuery
    if (upc) {
      params.append('q', upc);
      params.append('filter', 'buyingOptions:{FIXED_PRICE}');
    } else if (epid) {
      params.append('epid', epid);
    } else {
      params.append('q', searchQuery);
    }
    
    params.append('limit', '50');
    
    // Add category filter if provided
    if (category && CATEGORY_MAPPING[category]) {
      params.append('category_ids', CATEGORY_MAPPING[category]);
    }
    
    // Add condition filter if provided
    if (condition) {
      const conditionMap: Record<string, string> = {
        'excellent': 'NEW',
        'good': 'USED_EXCELLENT',
        'fair': 'USED_GOOD',
        'poor': 'USED_ACCEPTABLE'
      };
      const ebayCondition = conditionMap[condition.toLowerCase()] || 'USED';
      params.append('filter', `conditions:{${ebayCondition}}`);
    }
    
    console.log('Calling eBay Browse API:', `${baseUrl}/buy/browse/v1/item_summary/search?${params}`);
    
    // Call eBay Browse API
    const searchResponse = await fetch(
      `${baseUrl}/buy/browse/v1/item_summary/search?${params}`,
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
          'X-EBAY-C-ENDUSERCTX': 'contextualLocation=country=US,zip=45402'
        }
      }
    );
    
    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('eBay API error:', searchResponse.status, errorText);
      throw new Error(`eBay API error: ${searchResponse.status} - ${errorText}`);
    }
    
    const data = await searchResponse.json();
    console.log('eBay search results:', data.total || 0, 'total items');
    
    // Parse and simplify response
    const items = data.itemSummaries?.map((item: any) => ({
      itemId: item.itemId,
      title: item.title,
      price: {
        value: parseFloat(item.price?.value || '0'),
        currency: item.price?.currency || 'USD'
      },
      condition: item.condition,
      image: item.image?.imageUrl,
      url: item.itemWebUrl,
      seller: {
        username: item.seller?.username,
        feedbackPercentage: item.seller?.feedbackPercentage
      }
    })) || [];
    
    return new Response(
      JSON.stringify({
        success: true,
        query: searchQuery || upc || epid,
        total: data.total || 0,
        count: items.length,
        items: items
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('eBay search error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        count: 0,
        items: []
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

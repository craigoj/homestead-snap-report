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

// Category-specific minimum prices (Layer 1 filtering)
const MIN_PRICE_BY_CATEGORY: Record<string, number> = {
  electronics: 50,
  appliances: 100,
  furniture: 50,
  jewelry: 30,
  clothing: 15,
  art: 25,
  books: 5,
  tools: 40,
  sports: 35,
  other: 20
};

// Universal parts keywords (Layer 2 filtering)
const UNIVERSAL_PARTS_KEYWORDS = [
  'part', 'parts', 'replacement', 'repair', 'broken', 'for parts',
  'board', 'motherboard', 'main board', 'circuit', 'pcb',
  'power supply', 'cable', 'remote', 'stand', 'stand legs', 'mount',
  'bracket', 'screw', 'screws', 'hardware', 'manual', 'oem part',
  'cord', 'adapter', 'charger', 'wire', 'wiring'
];

// Category-specific parts keywords
const CATEGORY_PARTS_KEYWORDS: Record<string, string[]> = {
  electronics: ['screen', 'battery', 'charging port', 'speaker', 'digitizer', 'panel', 'lcd', 'led strip'],
  appliances: ['compressor', 'motor', 'thermostat', 'filter', 'gasket', 'seal', 'pump', 'valve'],
  furniture: ['leg', 'legs', 'hardware kit', 'cushion only', 'hinge', 'knob', 'handle'],
  automotive: ['engine part', 'transmission', 'alternator', 'starter'],
  tools: ['blade', 'bit', 'attachment', 'accessory']
};

// Helper function to check if listing is a part/accessory
function isPartListing(title: string, category: string): boolean {
  const lowerTitle = title.toLowerCase();
  
  // Check universal keywords
  if (UNIVERSAL_PARTS_KEYWORDS.some(kw => lowerTitle.includes(kw))) {
    return true;
  }
  
  // Check category-specific keywords
  const categoryKeywords = CATEGORY_PARTS_KEYWORDS[category] || [];
  return categoryKeywords.some(kw => lowerTitle.includes(kw));
}

// Helper function to get minimum price for category
function getMinPrice(category: string): number {
  return MIN_PRICE_BY_CATEGORY[category] || MIN_PRICE_BY_CATEGORY.other;
}

// Calculate statistics from filtered results
function calculateStatistics(items: any[]) {
  if (items.length === 0) {
    return { count: 0, average: 0, min: 0, max: 0, median: 0 };
  }
  
  const prices = items
    .map(item => parseFloat(item.price?.value || '0'))
    .filter(price => price > 0)
    .sort((a, b) => a - b);
  
  const count = prices.length;
  const average = prices.reduce((sum, p) => sum + p, 0) / count;
  const min = prices[0];
  const max = prices[prices.length - 1];
  const median = count % 2 === 0 
    ? (prices[count / 2 - 1] + prices[count / 2]) / 2
    : prices[Math.floor(count / 2)];
  
  return { count, average, min, max, median };
}

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
    const { searchQuery, category = 'other', condition, upc, epid }: SearchRequest = await req.json();
    
    if (!searchQuery && !upc && !epid) {
      throw new Error('searchQuery, upc, or epid is required');
    }

    console.log('eBay search request:', { searchQuery, category, condition, upc, epid });
    
    // Get minimum price for this category (Layer 1 filtering)
    const minPrice = getMinPrice(category);

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
    const filters = [];
    
    // Priority: UPC > EPID > searchQuery
    if (upc) {
      params.append('q', upc);
      filters.push('buyingOptions:{FIXED_PRICE}');
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
    
    // Layer 1: Add price filter to exclude very low-priced items
    filters.push(`price:[${minPrice}..]`);
    
    // Add condition filter if provided
    if (condition) {
      const conditionMap: Record<string, string> = {
        'excellent': 'NEW',
        'good': 'USED_EXCELLENT',
        'fair': 'USED_GOOD',
        'poor': 'USED_ACCEPTABLE'
      };
      const ebayCondition = conditionMap[condition.toLowerCase()] || 'USED';
      filters.push(`conditions:{${ebayCondition}}`);
    }
    
    // Combine all filters with comma
    if (filters.length > 0) {
      params.append('filter', filters.join(','));
    }
    
    console.log(`Applied Layer 1 filter: minimum price $${minPrice} for category '${category}'`);
    
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
    const rawCount = data.total || 0;
    console.log(`eBay search results: ${rawCount} total items from API`);
    
    // Parse and simplify response
    const rawItems = data.itemSummaries?.map((item: any) => ({
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
    
    console.log(`Received ${rawItems.length} listings from eBay API`);
    
    // Layer 2 & 3: Filter out parts and suspiciously low-priced items
    const filteredItems = rawItems.filter(item => {
      // Layer 2: Parts detection by title
      if (isPartListing(item.title, category)) {
        console.log(`Filtered out part: ${item.title}`);
        return false;
      }
      
      // Layer 3: Price validation (remove items below 50% of category minimum)
      const price = item.price.value;
      const priceThreshold = minPrice * 0.5;
      if (price > 0 && price < priceThreshold) {
        console.log(`Filtered out low price ($${price}): ${item.title}`);
        return false;
      }
      
      return true;
    });
    
    console.log(`After 3-layer filtering: ${filteredItems.length} complete unit listings (removed ${rawItems.length - filteredItems.length} parts/accessories)`);
    
    // Calculate statistics from filtered results
    const statistics = calculateStatistics(filteredItems);
    console.log(`Statistics - Avg: $${statistics.average.toFixed(2)}, Min: $${statistics.min}, Max: $${statistics.max}, Median: $${statistics.median}`);
    
    return new Response(
      JSON.stringify({
        success: true,
        query: searchQuery || upc || epid,
        category: category,
        raw_count: rawItems.length,
        filtered_count: filteredItems.length,
        items: filteredItems,
        statistics: statistics,
        filters_applied: {
          min_price: minPrice,
          parts_keywords_checked: true,
          price_threshold: minPrice * 0.5
        }
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

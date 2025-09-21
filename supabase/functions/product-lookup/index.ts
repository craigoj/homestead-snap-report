import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProductLookupRequest {
  barcode: string;
  barcodeType?: string;
}

interface ProductInfo {
  title?: string;
  brand?: string;
  model?: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  estimatedValue?: number;
  specifications?: Record<string, any>;
  source?: string;
}

interface ProductLookupResponse {
  success: boolean;
  product?: ProductInfo;
  error?: string;
  fallbackSuggestions?: string[];
}

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

async function lookupWithOpenFoodFacts(barcode: string): Promise<ProductInfo | null> {
  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await response.json();
    
    if (data.status === 1 && data.product) {
      const product = data.product;
      return {
        title: product.product_name || product.product_name_en,
        brand: product.brands,
        category: 'food',
        description: product.generic_name || product.categories,
        imageUrl: product.image_url,
        source: 'OpenFoodFacts'
      };
    }
  } catch (error) {
    console.log('OpenFoodFacts lookup failed:', error);
  }
  return null;
}

async function lookupWithUpcItemDb(barcode: string): Promise<ProductInfo | null> {
  try {
    // Note: This would require an API key for full access
    const response = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`);
    const data = await response.json();
    
    if (data.code === 'OK' && data.items && data.items.length > 0) {
      const item = data.items[0];
      return {
        title: item.title,
        brand: item.brand,
        category: item.category,
        description: item.description,
        imageUrl: item.images?.[0],
        source: 'UpcItemDB'
      };
    }
  } catch (error) {
    console.log('UpcItemDB lookup failed:', error);
  }
  return null;
}

async function lookupWithBarcodeSpider(barcode: string): Promise<ProductInfo | null> {
  try {
    // BarcodeSpider API (free tier available)
    const response = await fetch(`https://api.barcodespider.com/v1/lookup?token=demo&upc=${barcode}`);
    const data = await response.json();
    
    if (data.item_response && data.item_response.code === 200) {
      const item = data.item_response.item;
      return {
        title: item.title,
        brand: item.brand,
        category: item.category,
        description: item.description,
        source: 'BarcodeSpider'
      };
    }
  } catch (error) {
    console.log('BarcodeSpider lookup failed:', error);
  }
  return null;
}

async function enhanceWithAI(productInfo: ProductInfo, barcode: string): Promise<ProductInfo> {
  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return productInfo;
    }

    const prompt = `Based on this product information from barcode ${barcode}:
Title: ${productInfo.title || 'Unknown'}
Brand: ${productInfo.brand || 'Unknown'}
Category: ${productInfo.category || 'Unknown'}
Description: ${productInfo.description || 'None'}

Please provide enhanced information in JSON format:
{
  "enhancedTitle": "improved product title",
  "suggestedCategory": "best category for asset tracking",
  "estimatedValue": estimated_value_in_dollars,
  "specifications": {"key": "value"},
  "assetCategory": "electronics|appliances|tools|etc"
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a product information expert. Respond only with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    if (response.ok) {
      const aiData = await response.json();
      const enhancement = JSON.parse(aiData.choices[0].message.content);
      
      return {
        ...productInfo,
        title: enhancement.enhancedTitle || productInfo.title,
        category: enhancement.assetCategory || productInfo.category,
        estimatedValue: enhancement.estimatedValue,
        specifications: enhancement.specifications || {}
      };
    }
  } catch (error) {
    console.log('AI enhancement failed:', error);
  }
  
  return productInfo;
}

function generateFallbackSuggestions(barcode: string): string[] {
  const barcodePattern = barcode.substring(0, 3);
  
  // Common barcode prefixes and their typical categories
  const suggestions = [];
  
  if (barcodePattern >= '000' && barcodePattern <= '019') {
    suggestions.push('Food & Beverages', 'Grocery Items');
  } else if (barcodePattern >= '020' && barcodePattern <= '029') {
    suggestions.push('Retail Products', 'Consumer Goods');
  } else if (barcodePattern >= '030' && barcodePattern <= '039') {
    suggestions.push('Pharmaceuticals', 'Health Products');
  } else if (barcodePattern >= '040' && barcodePattern <= '049') {
    suggestions.push('Books', 'Publications');
  } else {
    suggestions.push('Electronics', 'Appliances', 'Tools', 'Household Items');
  }
  
  return suggestions;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { barcode, barcodeType }: ProductLookupRequest = await req.json();

    if (!barcode) {
      return new Response(
        JSON.stringify({ success: false, error: 'Barcode is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Looking up barcode: ${barcode} (type: ${barcodeType})`);

    // Try multiple lookup services in parallel
    const lookupPromises = [
      lookupWithOpenFoodFacts(barcode),
      lookupWithUpcItemDb(barcode),
      lookupWithBarcodeSpider(barcode)
    ];

    const results = await Promise.allSettled(lookupPromises);
    let bestResult: ProductInfo | null = null;

    // Find the first successful result
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        bestResult = result.value;
        break;
      }
    }

    if (bestResult) {
      // Enhance with AI if available
      const enhancedResult = await enhanceWithAI(bestResult, barcode);
      
      // Log successful lookup
      await supabase.from('audit_logs').insert({
        event_type: 'barcode_lookup_success',
        entity_type: 'barcode',
        entity_id: null,
        metadata: {
          barcode,
          barcodeType,
          source: enhancedResult.source,
          productTitle: enhancedResult.title
        }
      });

      const response: ProductLookupResponse = {
        success: true,
        product: enhancedResult
      };

      return new Response(
        JSON.stringify(response),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    } else {
      // No product found, provide fallback suggestions
      const fallbackSuggestions = generateFallbackSuggestions(barcode);
      
      // Log failed lookup
      await supabase.from('audit_logs').insert({
        event_type: 'barcode_lookup_failed',
        entity_type: 'barcode',
        entity_id: null,
        metadata: {
          barcode,
          barcodeType,
          reason: 'No product found in databases'
        }
      });

      const response: ProductLookupResponse = {
        success: false,
        error: 'Product not found in databases',
        fallbackSuggestions
      };

      return new Response(
        JSON.stringify(response),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (error) {
    console.error('Product lookup error:', error);
    
    // Log error
    try {
      await supabase.from('error_logs').insert({
        error_type: 'product_lookup',
        error_message: error.message,
        error_context: {
          url: req.url,
          method: req.method,
          timestamp: new Date().toISOString()
        }
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error during product lookup' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
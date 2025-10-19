import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValuationRequest {
  title: string;
  description?: string;
  brand?: string;
  model?: string;
  category: string;
  condition: string;
  purchase_date?: string;
  purchase_price?: number;
  imageUrl?: string;
  upc?: string;
  epid?: string;
}

interface EnhancedValuationResponse {
  estimated_value: number;
  confidence: number;
  value_range: {
    min: number;
    max: number;
  };
  reasoning: string;
  depreciation_rate?: number;
  data_source: 'ebay' | 'ai' | 'hybrid';
  ebay_insights?: {
    average_price: number;
    listing_count: number;
    price_range: { min: number; max: number; };
    sample_items?: Array<{
      title: string;
      price: number;
      condition: string;
    }>;
  };
  ai_estimate?: {
    estimated_value: number;
    reasoning: string;
  };
  market_trend?: 'stable' | 'appreciating' | 'depreciating';
  last_updated: string;
}

async function getEbayValuation(assetData: ValuationRequest) {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    const searchQuery = `${assetData.brand || ''} ${assetData.model || ''} ${assetData.title}`.trim();
    
    console.log('Attempting eBay search for:', searchQuery);
    
    const response = await fetch(
      `${supabaseUrl}/functions/v1/ebay-browse-search`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          searchQuery,
          category: assetData.category,
          condition: assetData.condition,
          upc: assetData.upc,
          epid: assetData.epid
        })
      }
    );
    
    if (!response.ok) {
      console.error('eBay search failed:', await response.text());
      return null;
    }
    
    const data = await response.json();
    
    // Check if we have sufficient filtered eBay data (lowered from 5 to 3 due to aggressive filtering)
    if (!data.success || data.filtered_count < 3) {
      console.log(`Insufficient eBay results (raw: ${data.raw_count}, filtered: ${data.filtered_count}), using AI fallback`);
      return null;
    }
    
    // Use pre-calculated statistics from eBay search
    const stats = data.statistics;
    
    if (!stats || stats.count < 3) {
      console.log('Not enough price data after filtering');
      return null;
    }
    
    // Get sample items (show what we're basing the valuation on)
    const sampleItems = data.items.slice(0, 3).map((item: any) => ({
      title: item.title,
      price: item.price.value,
      condition: item.condition
    }));
    
    console.log(`eBay data quality: ${data.raw_count} raw listings → ${data.filtered_count} after filtering (removed ${data.raw_count - data.filtered_count} parts/accessories)`);
    console.log(`Price statistics: Avg $${stats.average.toFixed(2)}, Range $${stats.min}-$${stats.max}, Median $${stats.median}`);
    
    return {
      average_price: Math.round(stats.average),
      price_range: { 
        min: Math.round(stats.min), 
        max: Math.round(stats.max) 
      },
      listing_count: stats.count,
      sample_items: sampleItems,
      raw_count: data.raw_count,
      filtered_count: data.filtered_count,
      median_price: Math.round(stats.median)
    };
    
  } catch (error) {
    console.error('eBay valuation error:', error);
    return null;
  }
}

async function getAIValuation(assetData: ValuationRequest, fallbackValue: number) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const prompt = `As an expert appraiser, estimate the current market value of this item:

Item Details:
- Title: ${assetData.title}
- Category: ${assetData.category}
- Condition: ${assetData.condition}
- Brand: ${assetData.brand || 'Unknown'}
- Model: ${assetData.model || 'Unknown'}
- Description: ${assetData.description || 'None'}
${assetData.purchase_date ? `- Purchase Date: ${assetData.purchase_date}` : ''}
${assetData.purchase_price ? `- Original Purchase Price: $${assetData.purchase_price}` : ''}

Consider:
1. Current market prices for similar items
2. Brand reputation and demand
3. Age and depreciation
4. Condition impact on value
5. Rarity or collectibility

Respond with only valid JSON in this format:
{
  "estimated_value": number,
  "confidence": number (0-100),
  "value_range": {
    "min": number,
    "max": number
  },
  "reasoning": "Brief explanation of valuation factors",
  "depreciation_rate": number (0-100, percentage per year if applicable)
}`;

  const messages = [
    {
      role: 'system',
      content: 'You are a professional appraiser with expertise in household items, electronics, furniture, and collectibles. Provide accurate market valuations based on current conditions and market trends.'
    },
    {
      role: 'user',
      content: prompt
    }
  ];

  // Add image analysis if provided
  if (assetData.imageUrl) {
    messages[1].content = [
      { type: 'text', text: prompt },
      { type: 'image_url', image_url: { url: assetData.imageUrl } }
    ];
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages,
      max_tokens: 800,
      temperature: 0.2
    }),
  });

  if (!response.ok) {
    console.error('OpenAI API error, using fallback valuation');
    return {
      estimated_value: fallbackValue,
      confidence: 60,
      value_range: {
        min: Math.round(fallbackValue * 0.7),
        max: Math.round(fallbackValue * 1.3)
      },
      reasoning: `Estimated using category-based rules for ${assetData.category} in ${assetData.condition} condition.`,
      depreciation_rate: 15
    };
  }

  const data = await response.json();
  let content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No content returned from OpenAI');
  }

  // Remove markdown code fences if present
  content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  try {
    const result = JSON.parse(content);
    result.estimated_value = Math.max(1, result.estimated_value || fallbackValue);
    result.confidence = Math.max(0, Math.min(100, result.confidence || 70));
    
    if (!result.value_range) {
      result.value_range = {
        min: Math.round(result.estimated_value * 0.7),
        max: Math.round(result.estimated_value * 1.3)
      };
    }

    result.reasoning = result.reasoning || 'AI-based valuation considering item details and market conditions.';
    return result;
    
  } catch (parseError) {
    console.error('Failed to parse AI response, using fallback:', parseError);
    return {
      estimated_value: fallbackValue,
      confidence: 50,
      value_range: {
        min: Math.round(fallbackValue * 0.7),
        max: Math.round(fallbackValue * 1.3)
      },
      reasoning: `Fallback valuation for ${assetData.category} in ${assetData.condition} condition.`,
      depreciation_rate: 15
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const assetData: ValuationRequest = await req.json();
    
    if (!assetData.title || !assetData.category || !assetData.condition) {
      return new Response(
        JSON.stringify({ error: 'Title, category, and condition are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing valuation request for:', assetData.title);

    // Rule-based fallback values by category and condition
    const fallbackValues = {
      electronics: { excellent: 500, good: 300, fair: 150, poor: 50 },
      furniture: { excellent: 400, good: 250, fair: 100, poor: 30 },
      appliances: { excellent: 600, good: 350, fair: 150, poor: 50 },
      jewelry: { excellent: 800, good: 500, fair: 200, poor: 50 },
      clothing: { excellent: 150, good: 80, fair: 30, poor: 10 },
      books: { excellent: 25, good: 15, fair: 8, poor: 2 },
      tools: { excellent: 200, good: 120, fair: 60, poor: 20 },
      sports: { excellent: 300, good: 180, fair: 80, poor: 25 },
      art: { excellent: 1000, good: 600, fair: 250, poor: 50 },
      other: { excellent: 200, good: 120, fair: 60, poor: 20 }
    };

    const fallbackValue = fallbackValues[assetData.category as keyof typeof fallbackValues]?.[assetData.condition as keyof typeof fallbackValues.electronics] || 100;

    // Try eBay first
    const ebayData = await getEbayValuation(assetData);
    
    let finalValuation: EnhancedValuationResponse;

    if (ebayData && ebayData.listing_count >= 3) {
      // Calculate confidence based on data quality
      let confidence = 70; // Base confidence for eBay data
      
      // Boost with more data points
      if (ebayData.listing_count >= 5) confidence += 5;
      if (ebayData.listing_count >= 10) confidence += 5;
      if (ebayData.listing_count >= 20) confidence += 5;
      
      // Reduce confidence if high price variance
      const priceRange = ebayData.price_range.max - ebayData.price_range.min;
      const priceVariance = priceRange / ebayData.average_price;
      if (priceVariance > 1.5) confidence -= 10;
      if (priceVariance > 2.0) confidence -= 5;
      
      // Boost confidence if filtering removed many parts (means we got better quality data)
      const filterRate = (ebayData.raw_count - ebayData.filtered_count) / ebayData.raw_count;
      if (filterRate > 0.5 && ebayData.filtered_count >= 5) {
        confidence += 5; // Aggressive filtering that still left good data
      }
      
      confidence = Math.max(60, Math.min(90, confidence));
      
      console.log(`Using eBay valuation with ${ebayData.filtered_count} listings (confidence: ${confidence}%)`);
      
      // Use median price for more accurate valuation (less affected by outliers)
      const valuationPrice = ebayData.median_price || ebayData.average_price;
      
      finalValuation = {
        estimated_value: valuationPrice,
        confidence: confidence,
        value_range: ebayData.price_range,
        data_source: 'ebay',
        ebay_insights: ebayData,
        reasoning: `Based on ${ebayData.filtered_count} verified eBay listings (${ebayData.raw_count} total results, ${ebayData.raw_count - ebayData.filtered_count} parts/accessories filtered out). ${ebayData.median_price ? 'Median' : 'Average'} price: $${valuationPrice.toLocaleString()}. Quality filtering ensures accurate market pricing.`,
        market_trend: 'stable',
        last_updated: new Date().toISOString()
      };
      
      console.log(`Final valuation: $${finalValuation.estimated_value} confidence: ${finalValuation.confidence}% source: ebay`);
    } else {
      // Fall back to AI-only
      console.log('Using AI-only valuation');
      const aiResult = await getAIValuation(assetData, fallbackValue);
      
      finalValuation = {
        ...aiResult,
        data_source: 'ai',
        ai_estimate: {
          estimated_value: aiResult.estimated_value,
          reasoning: aiResult.reasoning
        },
        last_updated: new Date().toISOString()
      };
    }

    console.log('Final valuation:', finalValuation.estimated_value, 'confidence:', finalValuation.confidence, 'source:', finalValuation.data_source);

    return new Response(
      JSON.stringify(finalValuation),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Valuation error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Valuation failed', 
        details: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

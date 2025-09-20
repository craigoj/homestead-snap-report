import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OCRRequest {
  imageUrl: string;
  imageBase64?: string;
}

interface OCRResponse {
  title?: string;
  description?: string;
  brand?: string;
  model?: string;
  serial_number?: string;
  category?: string;
  estimated_value?: number;
  confidence: number;
  extracted_text: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const { imageUrl, imageBase64 }: OCRRequest = await req.json();
    
    if (!imageUrl && !imageBase64) {
      return new Response(
        JSON.stringify({ error: 'Either imageUrl or imageBase64 is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing OCR request for:', imageUrl ? 'URL' : 'Base64');

    const imageInput = imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : imageUrl;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert at extracting structured information from images of household items and assets. 
            Analyze the image and extract the following information in JSON format:
            - title: A descriptive name for the item
            - description: Brief description of the item's condition and notable features
            - brand: Brand name if visible
            - model: Model number/name if visible
            - serial_number: Serial number if visible
            - category: One of: electronics, furniture, appliances, jewelry, clothing, books, tools, sports, art, other
            - estimated_value: Estimated value in USD based on the item's condition and type
            - confidence: Your confidence level (0-100) in the extracted information
            - extracted_text: All visible text from the image
            
            Return only valid JSON. If information is not clearly visible, omit that field or use null.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please extract information from this image:'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageInput
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.1
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    console.log('Raw OpenAI response:', content);

    // Parse the JSON response
    let ocrResult: OCRResponse;
    try {
      ocrResult = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      // Fallback: extract basic information
      ocrResult = {
        title: 'Extracted Item',
        confidence: 50,
        extracted_text: content
      };
    }

    // Ensure confidence is within valid range
    ocrResult.confidence = Math.max(0, Math.min(100, ocrResult.confidence || 50));

    console.log('Processed OCR result:', ocrResult);

    return new Response(
      JSON.stringify(ocrResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('OCR extraction error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'OCR extraction failed', 
        details: error.message,
        confidence: 0,
        extracted_text: ''
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
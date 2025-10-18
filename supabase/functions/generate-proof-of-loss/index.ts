import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProofOfLossRequest {
  lossEventId: string;
  formData: {
    insurerName: string;
    policyNumber: string;
    claimNumber?: string;
    swornStatement: string;
    signatureData: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const { lossEventId, formData }: ProofOfLossRequest = await req.json();

    // Fetch loss event
    const { data: lossEvent, error: lossError } = await supabaseClient
      .from('loss_events')
      .select('*')
      .eq('id', lossEventId)
      .eq('user_id', user.id)
      .single();

    if (lossError) throw lossError;

    // Fetch affected assets
    const { data: assets, error: assetsError } = await supabaseClient
      .from('assets')
      .select('*, asset_photos(*)')
      .eq('property_id', lossEvent.property_id);

    if (assetsError) throw assetsError;

    // Create or update proof of loss form
    const { data: form, error: formError } = await supabaseClient
      .from('proof_of_loss_forms')
      .upsert({
        user_id: user.id,
        loss_event_id: lossEventId,
        form_data: formData,
        insurer_name: formData.insurerName,
        policy_number: formData.policyNumber,
        claim_number: formData.claimNumber,
        sworn_statement_text: formData.swornStatement,
        signature_data: formData.signatureData,
        signature_date: new Date().toISOString(),
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (formError) throw formError;

    // Generate PDF (simplified - in production use a proper PDF library)
    const pdfContent = {
      formId: form.id,
      lossEvent,
      assets,
      formData,
      generatedAt: new Date().toISOString(),
    };

    console.log('Proof of Loss generated:', pdfContent);

    return new Response(
      JSON.stringify({ 
        success: true, 
        formId: form.id,
        message: 'Proof of Loss form submitted successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error generating proof of loss:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

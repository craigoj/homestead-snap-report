import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReportRequest {
  reportId: string;
  format: 'pdf' | 'csv';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { reportId, format }: ReportRequest = await req.json();
    
    if (!reportId || !format) {
      return new Response(
        JSON.stringify({ error: 'reportId and format are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating ${format.toUpperCase()} report for ID: ${reportId}`);

    // Get report details
    const { data: report, error: reportError } = await supabase
      .from('claim_reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (reportError || !report) {
      return new Response(
        JSON.stringify({ error: 'Report not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get assets for the report
    let assetsQuery = supabase
      .from('assets')
      .select(`
        *,
        asset_photos (file_path, is_primary),
        receipts (file_path)
      `)
      .eq('user_id', report.user_id);

    if (report.property_id) {
      assetsQuery = assetsQuery.eq('property_id', report.property_id);
    }

    const { data: assets, error: assetsError } = await assetsQuery;

    if (assetsError) {
      console.error('Error fetching assets:', assetsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch assets' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (format === 'csv') {
      // Generate CSV
      const csvContent = generateCSV(assets || [], report);
      
      // Upload CSV to storage
      const fileName = `report_${reportId}_${Date.now()}.csv`;
      const { error: uploadError } = await supabase.storage
        .from('reports')
        .upload(fileName, csvContent, {
          contentType: 'text/csv'
        });

      if (uploadError) {
        console.error('CSV upload error:', uploadError);
        throw new Error('Failed to upload CSV');
      }

      // Update report with file path
      await supabase
        .from('claim_reports')
        .update({ 
          file_path: fileName,
          status: 'ready'
        })
        .eq('id', reportId);

      return new Response(
        JSON.stringify({ 
          success: true, 
          filePath: fileName,
          downloadUrl: `${supabaseUrl}/storage/v1/object/public/reports/${fileName}`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (format === 'pdf') {
      // Generate PDF HTML content
      const htmlContent = generatePDFHTML(assets || [], report);
      
      // For now, save as HTML file (would need headless browser for actual PDF)
      const fileName = `report_${reportId}_${Date.now()}.html`;
      const { error: uploadError } = await supabase.storage
        .from('reports')
        .upload(fileName, htmlContent, {
          contentType: 'text/html'
        });

      if (uploadError) {
        console.error('PDF upload error:', uploadError);
        throw new Error('Failed to upload PDF');
      }

      // Update report with file path
      await supabase
        .from('claim_reports')
        .update({ 
          file_path: fileName,
          status: 'ready'
        })
        .eq('id', reportId);

      return new Response(
        JSON.stringify({ 
          success: true, 
          filePath: fileName,
          downloadUrl: `${supabaseUrl}/storage/v1/object/public/reports/${fileName}`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Unsupported format' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Report generation error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Report generation failed', 
        details: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function generateCSV(assets: any[], report: any): string {
  const headers = [
    'Title', 'Category', 'Brand', 'Model', 'Serial Number', 
    'Condition', 'Estimated Value', 'Purchase Date', 'Purchase Price', 
    'Description', 'Room', 'Photos', 'Receipts'
  ];

  const rows = assets.map(asset => [
    asset.title || '',
    asset.category || '',
    asset.brand || '',
    asset.model || '',
    asset.serial_number || '',
    asset.condition || '',
    asset.estimated_value || '0',
    asset.purchase_date || '',
    asset.purchase_price || '',
    asset.description || '',
    asset.room_id || '',
    asset.asset_photos?.length || '0',
    asset.receipts?.length || '0'
  ]);

  const csvContent = [
    `"${report.title} - Generated ${new Date().toLocaleDateString()}"`,
    '',
    headers.join(','),
    ...rows.map(row => row.map(field => `"${field}"`).join(','))
  ].join('\n');

  return csvContent;
}

function generatePDFHTML(assets: any[], report: any): string {
  const totalValue = assets.reduce((sum, asset) => sum + (asset.estimated_value || 0), 0);

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${report.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 40px; }
        .summary { background: #f5f5f5; padding: 20px; margin-bottom: 30px; }
        .asset { border: 1px solid #ddd; margin-bottom: 20px; padding: 15px; }
        .asset-header { font-weight: bold; font-size: 18px; margin-bottom: 10px; }
        .asset-details { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .photo { max-width: 100px; max-height: 100px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${report.title}</h1>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
    </div>

    <div class="summary">
        <h2>Summary</h2>
        <p><strong>Total Assets:</strong> ${assets.length}</p>
        <p><strong>Total Estimated Value:</strong> $${totalValue.toLocaleString()}</p>
        <p><strong>Report Type:</strong> ${report.report_type}</p>
    </div>

    <h2>Assets</h2>
    ${assets.map(asset => `
        <div class="asset">
            <div class="asset-header">${asset.title}</div>
            <div class="asset-details">
                <div><strong>Category:</strong> ${asset.category || 'N/A'}</div>
                <div><strong>Condition:</strong> ${asset.condition || 'N/A'}</div>
                <div><strong>Brand:</strong> ${asset.brand || 'N/A'}</div>
                <div><strong>Model:</strong> ${asset.model || 'N/A'}</div>
                <div><strong>Estimated Value:</strong> $${(asset.estimated_value || 0).toLocaleString()}</div>
                <div><strong>Purchase Price:</strong> $${(asset.purchase_price || 0).toLocaleString()}</div>
            </div>
            ${asset.description ? `<p><strong>Description:</strong> ${asset.description}</p>` : ''}
        </div>
    `).join('')}

    <div style="margin-top: 40px; text-align: center; color: #666;">
        <p>This report was generated automatically. Please verify all information for accuracy.</p>
    </div>
</body>
</html>
  `;
}
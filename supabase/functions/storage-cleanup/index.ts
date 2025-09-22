import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CleanupResult {
  cleaned_files: number;
  freed_space_bytes: number;
  errors: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const result: CleanupResult = {
      cleaned_files: 0,
      freed_space_bytes: 0,
      errors: []
    };

    console.log('Starting storage cleanup...');

    // Clean up orphaned asset photos
    try {
      const { data: orphanedPhotos } = await supabaseClient
        .from('asset_photos')
        .select('file_path, file_size')
        .is('asset_id', null);

      if (orphanedPhotos && orphanedPhotos.length > 0) {
        for (const photo of orphanedPhotos) {
          try {
            // Remove file from storage
            const { error: deleteError } = await supabaseClient
              .storage
              .from('asset-images')
              .remove([photo.file_path]);

            if (!deleteError) {
              // Remove database record
              await supabaseClient
                .from('asset_photos')
                .delete()
                .eq('file_path', photo.file_path);

              result.cleaned_files++;
              result.freed_space_bytes += photo.file_size || 0;
            } else {
              result.errors.push(`Failed to delete ${photo.file_path}: ${deleteError.message}`);
            }
          } catch (error) {
            result.errors.push(`Error processing ${photo.file_path}: ${error.message}`);
          }
        }
      }
    } catch (error) {
      result.errors.push(`Failed to query orphaned photos: ${error.message}`);
    }

    // Clean up orphaned receipts
    try {
      const { data: orphanedReceipts } = await supabaseClient
        .from('receipts')
        .select('file_path, file_size')
        .is('asset_id', null);

      if (orphanedReceipts && orphanedReceipts.length > 0) {
        for (const receipt of orphanedReceipts) {
          try {
            // Remove file from storage
            const { error: deleteError } = await supabaseClient
              .storage
              .from('receipts')
              .remove([receipt.file_path]);

            if (!deleteError) {
              // Remove database record
              await supabaseClient
                .from('receipts')
                .delete()
                .eq('file_path', receipt.file_path);

              result.cleaned_files++;
              result.freed_space_bytes += receipt.file_size || 0;
            } else {
              result.errors.push(`Failed to delete ${receipt.file_path}: ${deleteError.message}`);
            }
          } catch (error) {
            result.errors.push(`Error processing ${receipt.file_path}: ${error.message}`);
          }
        }
      }
    } catch (error) {
      result.errors.push(`Failed to query orphaned receipts: ${error.message}`);
    }

    // Clean up expired cache entries
    try {
      const { error: cacheError } = await supabaseClient
        .from('api_cache')
        .delete()
        .lt('expires_at', new Date().toISOString());

      if (cacheError) {
        result.errors.push(`Failed to clean cache: ${cacheError.message}`);
      }
    } catch (error) {
      result.errors.push(`Cache cleanup error: ${error.message}`);
    }

    // Clean up old error logs (keep last 30 days)
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { error: logError } = await supabaseClient
        .from('error_logs')
        .delete()
        .lt('created_at', thirtyDaysAgo.toISOString());

      if (logError) {
        result.errors.push(`Failed to clean error logs: ${logError.message}`);
      }
    } catch (error) {
      result.errors.push(`Error log cleanup error: ${error.message}`);
    }

    console.log('Storage cleanup completed:', result);

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Storage cleanup failed:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Storage cleanup failed',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

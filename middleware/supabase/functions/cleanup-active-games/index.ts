import { serve } from 'std/server';
import { corsHeaders } from '../_shared/cors.ts';
import { createSupabaseClient } from '../_shared/supabase-client.ts';

console.log(`🚀 Function "cleanup-active-games" up and running!`);

serve(async (req: Request) => {
  const { method } = req;

  // This is needed if you're planning to invoke your function from a browser.
  if (method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });
  }

  try {
    const supabase = createSupabaseClient(req);

    /**
     * Fetch inactive games starting within the next hour
     */
    const { error } = await supabase
      .from('active_game')
      .delete()
      .lt('start_at', Date.now() - 1800000) // Cleanup ended games started 30 mins ago
      .eq('ended', true);

    if (error != null) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        status: 204,
        statusText: 'No Content',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

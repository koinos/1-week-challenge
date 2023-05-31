import { serve } from 'std/server';
import { corsHeaders } from '../_shared/cors.ts';
import { createSupabaseClient } from '../_shared/supabase-client.ts';
import { type ActiveGame, type Game } from '../../../schema/index.ts';

console.log(`🚀 Function "schedule-game" up and running!`);

serve(async (req: Request) => {
  try {
    const { method } = req;

    // This is needed if you're planning to invoke your function from a browser.
    if (method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    const supabase = createSupabaseClient(req);

    /**
     * Fetch inactive games starting within the next hour
     */
    const { data, error } = await supabase
      .from<Game>('game')
      .select('id, start_at, price')
      .gte('start_at', Date.now())
      .lt('start_at', Date.now() + 3600000)
      .eq('active', false);

    if (error != null) {
      throw error;
    }

    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        const game = data[i];

        /**
         * Insert new active_game for app to watch realtime
         */
        const { error: insertError } = await supabase
          .from<ActiveGame>('active_game')
          .insert({
            id: game.id,
            start_at: game.start_at,
            round: 0,
            round_ends: game.start_at,
            price: game.price,
          });

        if (insertError == null) {
          /**
           * Mark game to active
           */
          const { error: updateError } = await supabase
            .from<Game>('game')
            .update({ active: true })
            .eq('id', game.id);

          if (updateError != null) {
            console.error('Could not set game to active', updateError);
          }
        } else {
          console.error('Could not insert active game', insertError);
        }
      }
    }

    return new Response(JSON.stringify({ newActiveGames: data.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

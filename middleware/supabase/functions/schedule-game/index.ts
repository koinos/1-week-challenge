import { serve } from 'std/server';
import { createClient } from '@supabase/supabase-js';
import { corsHeaders } from '../_shared/cors.ts';

console.log(`🚀 Function "schedule-game" up and running!`);

serve(async (req: Request) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            Authorization: req.headers.get('Authorization')!,
          },
        },
      }
    );

    // Fetch inactive games starting within the next hour
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

        // Insert new active_game for app to watch realtime
        const { error: insertError } = await supabase
          .from('active_game')
          .insert({
            id: game.id,
            start_at: game.start_at,
            round: 0,
            price: game.price,
          });

        if (insertError == null) {
          // Mark game to active
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

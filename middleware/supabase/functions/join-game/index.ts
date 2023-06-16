import { serve } from 'std/server';
import { corsHeaders } from '../_shared/cors.ts';
import { createSupabaseClient } from '../_shared/supabase-client.ts';
import { type ActiveGame } from '../../../schema/index.ts';

console.log(`🚀 Function "join-game" up and running!`);

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
    const input: {
      // TODO: Fetch playerId from auth context when authentication is integrated
      playerId: string;
      gameId: string;
    } = await req.json();

    const { playerId, gameId } = input;

    const supabase = createSupabaseClient(req);

    /**
     * Fetch active_game
     */
    const {
      data: activeGame,
      error: activeGameError,
    }: { data: ActiveGame; error: any } = await supabase
      .from('active_game')
      .select('*')
      .eq('id', gameId)
      .limit(1)
      .single();

    if (activeGameError != null) {
      // Return bad request response
      throw activeGameError;
    }

    if (activeGame == null) {
      // Return bad request response
      throw new Error('Game not active');
    }

    if (activeGame.start_at < Date.now()) {
      // Return bad request response
      throw new Error('Game already started');
    }

    /**
     * Upsert new player to make sure player exists
     */
    // TODO: Remove when authentication is integrated. Then player will be created when connecting wallet
    const { error: upsertPlayerError }: { error: Error } = await supabase
      .from('player')
      .upsert({ id: playerId })
      .select();

    if (upsertPlayerError != null) {
      // Return bad request response
      throw upsertPlayerError;
    }

    /**
     * Insert new player_game for app to watch realtime
     */
    const { error: insertPlayerGameError }: { error: Error } = await supabase
      .from('player_game')
      .insert({
        player_id: playerId,
        game_id: gameId,
      });

    if (insertPlayerGameError != null) {
      // Unique constraint prevents players from double joining games
      if (insertPlayerGameError.message.includes('player_game_uq')) {
        throw new Error('Player has already joined game');
      }

      // Return bad request response
      throw insertPlayerGameError;
    }

    /**
     * Update player count for active_game
     */
    const { error: updateError }: { error: Error } = await supabase
      .from('active_game')
      .update({
        participant_count: Number(activeGame.participant_count) + 1,
        players_remaining: Number(activeGame.players_remaining) + 1,
      })
      .eq('id', gameId);

    if (updateError != null) {
      // Return bad request response
      throw new Error('Could not update players_remaining for active game');
    }

    return new Response(
      JSON.stringify({
        status: 204,
        statusText: 'No Content',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 204,
      }
    );
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

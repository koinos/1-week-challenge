import { serve } from 'std/server';
import { corsHeaders } from '../_shared/cors.ts';
import { createSupabaseClient } from '../_shared/supabase-client.ts';
import {
  type ActiveGame,
  type PlayerGame,
  type Question,
} from '../../../schema/index.ts';

const now = new Date();
console.log(
  `🚀 Function "process-question" called, at ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
);

serve(async (req: Request) => {
  try {
    const { method } = req;

    // This is needed if you're planning to invoke your function from a browser.
    if (method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    const supabase = createSupabaseClient(req);

    /**
     * Fetch started active_games
     */
    const { data: activeGamesData, error: activeGamesError } = await supabase
      .from('active_game')
      .select('*')
      // Filter for started games
      .lte('start_at', Date.now())
      // Filter for active_games where round has ended
      .lte('round_ends', Date.now())
      // Game must have started / have question_id
      .not('question_id', 'is', null)
      // Answer must not be provided yet
      .is('answer', null)
      // Only pick next question when game hasn't ended yet
      .eq('ended', false);

    if (activeGamesError != null) {
      throw activeGamesError;
    }

    const response: [{ gameId: string; question: string }] = [];

    if (Array.isArray(activeGamesData)) {
      for (let i = 0; i < activeGamesData.length; i++) {
        const activeGame: ActiveGame = activeGamesData[i];

        /**
         * Get question
         */
        const {
          data: question,
          error: questionError,
        }: { data: Question; error: any } = await supabase
          .from('question')
          .select('*')
          .eq('id', activeGame.question_id)
          .limit(1)
          .single();

        if (questionError != null) {
          // Return bad request response
          throw questionError;
        }

        if (question == null) {
          // Return bad request response
          throw new Error('Question not found');
        }

        /**
         * We have a winner! Update active_game with winner playerId
         */
        let winner: string | undefined;
        let ended: boolean | undefined;

        if (activeGame.right_count === 1) {
          /**
           * Get the (1) player_game that has proceeded to next round and isn't eliminated
           */
          const {
            data: playerGame,
            error: playerGameError,
          }: { data: PlayerGame; error: any } = await supabase
            .from('player_game')
            .select('*')
            .eq('round', activeGame.round + 1)
            .eq('eliminated', false)
            .eq('game_id', activeGame.id)
            .limit(1)
            .single();

          if (playerGameError != null) {
            // Return bad request response
            throw playerGameError;
          }

          if (playerGame == null) {
            // If playerGame is not found we've messed up somewhere so this should not occur
            // Return bad request response
            throw new Error('Player game for winner not found');
          }

          winner = playerGame.player_id;
          ended = true;

          /**
           * Update rewards to player_game of winner
           * This way we have a log of all games a player has won/lost
           */
          const { error: updatePGError }: { error: Error } = await supabase
            .from('player_game')
            .update({
              rewards: activeGame.rewards,
            })
            .eq('player_id', winner)
            .eq('game_id', activeGame.id);

          if (updatePGError != null) {
            // Return bad request response
            throw new Error('Could not update rewards for player_game');
          }
        }

        /**
         * End game when all player eliminated
         */
        if (activeGame.right_count === 0) {
          ended = true;
        }

        /**
         * Update active_game with answer + winner
         */
        const { error: updateAGError } = await supabase
          .from('active_game')
          .update({
            players_remaining: activeGame.right_count,
            answer: question.is_fact,
            real_fact_if_fiction: question.real_fact_if_fiction,
            winner,
            ended,
          })
          .eq('id', activeGame.id);

        if (updateAGError != null) {
          // Return bad request response
          throw updateAGError;
        }

        /**
         * Update game (history) with winner + participant_count if game has ended
         */
        if (winner != null || ended === true) {
          const { error: updateGameError } = await supabase
            .from('game')
            .update({
              winner,
              participant_count: activeGame.participant_count,
            })
            .eq('id', activeGame.id);

          if (updateGameError != null) {
            // Return bad request response
            throw updateGameError;
          }
        }

        /**
         * Add to response for debugging purpose only (to display in vue-test app)
         */
        response.push({
          gameId: activeGame.id,
          round: activeGame.round,
          players_remaining: activeGame.right_count,
          winner,
          ended,
        });
      }
    }

    return new Response(JSON.stringify({ results: response }), {
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

import { serve } from 'std/server';
import { corsHeaders } from '../_shared/cors.ts';
import { createSupabaseClient } from '../_shared/supabase-client.ts';
import { type ActiveGame, type Question } from '../../../schema/index.ts';

console.log(`🚀 Function "pick-next-question-game" up and running!`);

serve(async (req: Request) => {
  try {
    const { method } = req;

    // This is needed if you're planning to invoke your function from a browser.
    if (method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    // TODO: Fetch round duration from setting or env var
    const roundDuration = 30;

    const supabase = createSupabaseClient(req);

    /**
     * Fetch started active_games
     */
    const { data: activeGamesData, error: activeGamesError } = await supabase
      .from('active_game')
      .select('*')
      // Filter for started games
      .lte('start_at', Date.now())
      // Only pick next question when game hasn't ended yet
      .eq('ended', false)
      .or(
        // Only pick next question when there are minimal two players remaining and answer is null
        // Only active_games with an answer are ready for the next round
        // After each round has ended the answer will be added to the active_game
        `and(right_count.gte.2, answer.not.is.null),` +
          // Or otherwise when it's the first round
          `round.eq.0`
      );

    if (activeGamesError != null) {
      throw activeGamesError;
    }

    const response: [{ gameId: string; question: string }] = [];

    if (Array.isArray(activeGamesData)) {
      for (let i = 0; i < activeGamesData.length; i++) {
        const activeGame: ActiveGame = activeGamesData[i];

        // Call postgres function with rpc call
        const { data, error: randomQuestionError } = await supabase.rpc(
          'pick_random_question',
          {
            game_id: activeGame.id,
          }
        );

        if (randomQuestionError != null) {
          // Return bad request response
          throw randomQuestionError;
        }

        /**
         * Update question for active_game
         */
        if (data?.id != null) {
          const randomQuestion: Question = data;
          const fieldsToUpdate = {
            round: activeGame.round + 1,
            round_ends: activeGame.round_ends + roundDuration,
            question: randomQuestion.question,
            question_id: randomQuestion.id,
            answer: null,
            real_fact_if_fiction: null,
            players_remaining: activeGame.right_count,
            right_count: 0,
            wrong_count: 0,
          };

          /**
           * Insert new game_question
           */
          const { error: insertError } = await supabase
            .from('game_question')
            .insert({
              game_id: activeGame.id,
              question_id: randomQuestion.id,
              round: fieldsToUpdate.round,
              started_count: fieldsToUpdate.players_remaining,
            });

          if (insertError != null) {
            // Return bad request response
            throw insertError;
          }

          // Add to response for debugging purpose only (to display in vue-test app)
          response.push({
            gameId: activeGame.id,
            ...fieldsToUpdate,
          });

          const { error: updateError } = await supabase
            .from('active_game')
            .update(fieldsToUpdate)
            .eq('id', activeGame.id);

          if (updateError != null) {
            // Return bad request response
            throw new Error('Could not update next question for active game');
          }
        } else {
          // Return bad request response
          throw new Error('Could not pick next question for active game');
        }
      }
    }

    return new Response(JSON.stringify({ newQuestions: response }), {
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

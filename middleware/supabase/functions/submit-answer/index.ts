import { serve } from 'std/server';
import { corsHeaders } from '../_shared/cors.ts';
import { createSupabaseClient } from '../_shared/supabase-client.ts';
import {
  type ActiveGame,
  type GameQuestion,
  type PlayerGame,
  type Question,
} from '../../../schema/index.ts';

console.log(`🚀 Function "submit-answer" up and running!`);

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
      answer: boolean;
    } = await req.json();

    const { playerId, gameId, answer } = input;

    const supabase = createSupabaseClient(req);

    /**
     * Fetch player_game to verify player is still in the game
     */
    const { data: playerGameData, error: playerGameError } = await supabase
      .from<PlayerGame>('player_game')
      .select('*')
      .eq('player_id', playerId)
      .eq('game_id', gameId);

    if (playerGameError != null) {
      // Return bad request response
      throw playerGameError;
    }

    if (playerGameData.length !== 1) {
      // Return bad request response
      throw new Error('Player did not join this game');
    }

    /**
     * Fetch active_game
     */
    const { data: activeGameData, error: activeGameError } = await supabase
      .from<ActiveGame>('active_game')
      .select('*')
      .eq('id', gameId);

    if (activeGameError != null) {
      // Return bad request response
      throw activeGameError;
    }

    if (
      activeGameData.length !== 1 ||
      activeGameData[0].start_at > Date.now()
    ) {
      // Return bad request response
      throw new Error('Game not active');
    }

    const activeGame: ActiveGame = activeGameData[0];

    /**
     * Check if player is still in the game
     */
    const playerGame: PlayerGame = playerGameData[0];

    // When round doesn't match the player has timed out in previous round
    if (playerGame.eliminated) {
      // Return bad request response
      throw new Error('Player is eliminated from this game');
    }

    /**
     * Check if player hasn't already answered
     */
    if (playerGame.answers[activeGame.round] != null) {
      // Return bad request response
      throw new Error('Player has already answered this round');
    }

    /**
     * Check if answered is provided within provided time
     */
    const timedOut = activeGame.round_ends > Date.now();

    console.log({ timedOut, ends: activeGame.round_ends, now: Date.now() });

    /**
     * Get correct answer to question
     */
    const { data: questionData, error: questionError } = await supabase
      .from<Question>('question')
      .select('*')
      .eq('id', activeGame.question_id);

    if (questionError != null) {
      // Return bad request response
      throw questionError;
    }

    if (questionData.length !== 1) {
      // Return bad request response
      throw new Error('Question not found');
    }

    const question: Question = questionData[0];
    const isRight = question.is_fact === answer;
    const isWrong = question.is_fact !== answer;

    /**
     * Save answer to player game + update status
     */
    const { error: updateError }: { error: Error } = await supabase
      .from<PlayerGame>('player_game')
      .update({
        // User proceeds to next round when the question is rightfully answered within time
        round: playerGame.round + (isRight && !timedOut ? 1 : 0),
        eliminated: isWrong || timedOut,
        answers: {
          ...playerGame.answers,
          // Only save answer when user hasn't timed out
          ...(timedOut ? {} : { [activeGame.round]: answer }),
        },
      })
      .eq('id', playerGame.id);

    if (updateError != null) {
      // Return bad request response
      throw new Error('Could not update answer for player_game');
    }

    if (!timedOut) {
      /**
       * Update game_question counts
       */
      const { error: updateGQError } = await supabase
        .from<GameQuestion>('game_question')
        .update({
          right_count: activeGame.right_count + (isRight ? 1 : 0),
          wrong_count: activeGame.wrong_count + (isWrong ? 1 : 0),
        })
        .eq('game_id', activeGame.id)
        .eq('question_id', activeGame.question_id)
        .eq('round', activeGame.round);

      if (updateGQError != null) {
        throw updateGQError;
      }

      /**
       * Update active_game counts
       */
      const { error: updateAGError } = await supabase
        .from<ActiveGame>('active_game')
        .update({
          right_count: activeGame.right_count + (isRight ? 1 : 0),
          wrong_count: activeGame.wrong_count + (isWrong ? 1 : 0),
        })
        .eq('id', activeGame.id);

      if (updateAGError != null) {
        throw updateAGError;
      }
    }

    return new Response(JSON.stringify({ right: isRight, timedOut }), {
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

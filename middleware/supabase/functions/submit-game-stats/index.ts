import { serve } from 'std/server';
import { corsHeaders } from '../_shared/cors.ts';
import {
  Provider,
  Contract,
  Signer,
} from 'https://esm.sh/koilib@v5.5.6?target=deno';
import { type Game } from '../../../schema/index.ts';
import { createSupabaseClient } from '../_shared/supabase-client.ts';
import { GamestatsAbi } from './gamestats-abi.ts';

console.log(`🚀 Function "submit-game-stats" up and running!`);

serve(async (req: Request) => {
  try {
    const { method } = req;

    // This is needed if you're planning to invoke your function from a browser.
    if (method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    const supabase = createSupabaseClient(req);

    const { gameId } = await req.json();

    /**
     * Retrieve game
     */
    const { data: game, error: gameError }: { data: Game; error: any } =
      await supabase
        .from('game')
        .select('*')
        .eq('id', gameId)
        .limit(1)
        .single();

    if (gameError != null) {
      // Return bad request response
      throw gameError;
    }

    if (game == null || game.winner_id == null || game.price == null) {
      // Return bad request response
      throw new Error('Game for submitting results not found');
    }

    /**
     * Submit game stats to Koinos contract
     */
    const seed = '1234';
    const contractId = '19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ';

    // Define signer + provider
    const provider = new Provider(['https://api.koinos.io']);
    const signer = Signer.fromSeed(seed);

    signer.provider = provider;

    // // Create contract to call
    const factOrFictionContract = new Contract({
      id: contractId,
      abi: GamestatsAbi,
      provider,
      signer,
    });

    const factOrFiction = factOrFictionContract.functions;

    console.log({
      factOrFiction,
      data: {
        game_id: 1, // game.id,
        timestamp: Date.now(),
        rewards: 5000, // game.price,
        winner: '13KndWFNkxTWmcoUieRndFLspebpr7cPQr', // game.winner_id,
      },
    });

    const { transaction, receipt } = await factOrFiction.submit_game_stats({
      game_id: 1, // game.id,
      timestamp: Date.now(),
      rewards: 5000, // game.price,
      winner: '13KndWFNkxTWmcoUieRndFLspebpr7cPQr', // game.winner_id,
    });

    if (transaction == null || transaction.id == null) {
      throw new Error('Could not submit transaction to Koinos blockchain');
    }

    console.log(
      `Transaction id ${transaction.id as string} submitted. Receipt:`
    );
    console.log(receipt);

    if (receipt.logs != null) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Transfer failed. Logs: ${receipt.logs.join(',')}`);
    }

    // Wait to be mined
    const { blockNumber } = await transaction.wait();

    if (blockNumber == null) {
      throw new Error('Transaction could not be mined');
    }

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`Transaction mined. Block number: ${blockNumber}`);

    // Verify the game stats have been submitted
    const { result } = await factOrFiction.get_games_stats({
      offset_key: {
        game_id: game.id,
      },
      limit: 1,
    });

    if (result == null) {
      throw new Error('Game has been submitted but could not be verified');
    }

    /**
     * Add to response for debugging purpose only (to display in vue-test app)
     */
    const response = {
      gameId: game.id,
      stats: result,
      minedInBlock: blockNumber,
      transactionId: transaction.id,
    };

    return new Response(JSON.stringify({ results: response }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

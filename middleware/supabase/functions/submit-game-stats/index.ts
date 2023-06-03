import { serve } from 'std/server';
import { corsHeaders } from '../_shared/cors.ts';
import {
  Provider,
  Contract,
  Signer,
} from 'https://raw.githubusercontent.com/roaminro/koilib/2e82963ea3b3fa5196fe962a880fa7c126d05242/deno/mod.ts';
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

    if (game == null || game.winner == null || game.rewards == null) {
      // Return bad request response
      throw new Error('Game for submitting results not found');
    }

    /**
     * Submit game stats to Koinos contract
     */
    const pk = Deno.env.get('SIGNER_PRIVATE_KEY');
    const contractId = Deno.env.get('CONTRACT_ADDRESS');
    const rpcNodes = [Deno.env.get('RPC_NODE')];

    // Define signer + provider
    const provider = new Provider(rpcNodes);
    const signer = Signer.fromWif(pk);

    signer.provider = provider;

    // Create contract to call
    const factOrFictionContract = new Contract({
      id: contractId,
      abi: GamestatsAbi,
      provider,
      signer,
    });

    const factOrFiction = factOrFictionContract.functions;

    // Call contract
    const { transaction, receipt } = await factOrFiction.submit_game_stats({
      game_stats: {
        game_id: game.id,
        timestamp: game.start_at,
        rewards: game.rewards,
        winner: game.winner,
      },
    });

    if (transaction == null || transaction.id == null) {
      throw new Error('Could not submit transaction to Koinos blockchain');
    }

    if (receipt.logs != null) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Transfer failed. Logs: ${receipt.logs.join(',')}`);
    }

    // Wait to be mined
    const { blockNumber } = await transaction.wait();

    if (blockNumber == null) {
      throw new Error('Transaction could not be mined');
    }

    /**
     * Add to response for debugging purpose only (to display in vue-test app)
     */
    const response = {
      gameId: game.id,
      minedInBlock: blockNumber,
      transactionId: transaction.id,
    };

    return new Response(JSON.stringify({ ...response }), {
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

import { System, Protobuf, authority } from "@koinos/sdk-as";
import { token } from "./proto/token";

export class Token {
  name(args: token.name_arguments): token.name_result {
    // YOUR CODE HERE

    const res = new token.name_result();
    // res.value = ;

    return res;
  }

  symbol(args: token.symbol_arguments): token.symbol_result {
    // YOUR CODE HERE

    const res = new token.symbol_result();
    // res.value = ;

    return res;
  }

  decimals(args: token.decimals_arguments): token.decimals_result {
    // YOUR CODE HERE

    const res = new token.decimals_result();
    // res.value = ;

    return res;
  }

  total_supply(args: token.total_supply_arguments): token.total_supply_result {
    // YOUR CODE HERE

    const res = new token.total_supply_result();
    // res.value = ;

    return res;
  }

  max_supply(args: token.max_supply_arguments): token.max_supply_result {
    // YOUR CODE HERE

    const res = new token.max_supply_result();
    // res.value = ;

    return res;
  }

  balance_of(args: token.balance_of_arguments): token.balance_of_result {
    // const owner = args.owner;

    // YOUR CODE HERE

    const res = new token.balance_of_result();
    // res.value = ;

    return res;
  }

  transfer(args: token.transfer_arguments): token.empty_message {
    // const from = args.from;
    // const to = args.to;
    // const value = args.value;

    // YOUR CODE HERE

    const res = new token.empty_message();

    return res;
  }

  mint(args: token.mint_arguments): token.empty_message {
    // const to = args.to;
    // const value = args.value;

    // YOUR CODE HERE

    const res = new token.empty_message();

    return res;
  }

  burn(args: token.burn_arguments): token.empty_message {
    // const from = args.from;
    // const value = args.value;

    // YOUR CODE HERE

    const res = new token.empty_message();

    return res;
  }

  submit_game_stats(
    args: token.submit_game_stats_arguments
  ): token.empty_message {
    // const game_stats = args.game_stats;

    // YOUR CODE HERE

    const res = new token.empty_message();

    return res;
  }

  get_player_info(args: token.get_player_info_arguments): token.player_object {
    // const player = args.player;

    // YOUR CODE HERE

    const res = new token.player_object();
    // res.wins = ;

    return res;
  }

  get_leaderboard(
    args: token.get_leaderboard_arguments
  ): token.get_leaderboard_result {
    // const offset_key = args.offset_key;
    // const limit = args.limit;
    // const descending = args.descending;

    // YOUR CODE HERE

    const res = new token.get_leaderboard_result();
    // res.leaderboard = ;

    return res;
  }

  get_games_stats(
    args: token.get_games_stats_arguments
  ): token.get_games_stats_result {
    // const offset_key = args.offset_key;
    // const limit = args.limit;
    // const descending = args.descending;

    // YOUR CODE HERE

    const res = new token.get_games_stats_result();
    // res.games_stats = ;

    return res;
  }
}

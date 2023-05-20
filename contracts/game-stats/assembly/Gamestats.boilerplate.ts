import { System, Protobuf, authority } from "@koinos/sdk-as";
import { gamestats } from "./proto/gamestats";

export class Gamestats {
  initialize(args: gamestats.initialize_arguments): gamestats.empty_message {
    // const rewards_token_address = args.rewards_token_address;

    // YOUR CODE HERE

    const res = new gamestats.empty_message();

    return res;
  }

  submit_game_stats(
    args: gamestats.submit_game_stats_arguments
  ): gamestats.empty_message {
    // const game_stats = args.game_stats;

    // YOUR CODE HERE

    const res = new gamestats.empty_message();

    return res;
  }

  get_player_info(
    args: gamestats.get_player_info_arguments
  ): gamestats.player_object {
    // const player = args.player;

    // YOUR CODE HERE

    const res = new gamestats.player_object();
    // res.wins = ;

    return res;
  }

  get_leaderboard(
    args: gamestats.get_leaderboard_arguments
  ): gamestats.get_leaderboard_result {
    // const offset_key = args.offset_key;
    // const limit = args.limit;
    // const descending = args.descending;

    // YOUR CODE HERE

    const res = new gamestats.get_leaderboard_result();
    // res.leaderboard = ;

    return res;
  }

  get_games_stats(
    args: gamestats.get_games_stats_arguments
  ): gamestats.get_games_stats_result {
    // const offset_key = args.offset_key;
    // const limit = args.limit;
    // const descending = args.descending;

    // YOUR CODE HERE

    const res = new gamestats.get_games_stats_result();
    // res.games_stats = ;

    return res;
  }
}

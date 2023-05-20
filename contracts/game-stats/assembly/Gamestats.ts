import { Protobuf, System, SafeMath, authority, Token } from "@koinos/sdk-as";
import { gamestats } from "./proto/gamestats";
import { LeaderboardStorage } from "./state/LeaderboardStorage";
import { PlayersStorage } from "./state/PlayersStorage";
import { GamesStatsStorage } from "./state/GamesStatsStorage";
import { MetadataStorage } from "./state/MetadataStorage";

export class Gamestats {
  _contractId: Uint8Array = System.getContractId();
  _metadataStorage: MetadataStorage = new MetadataStorage(this._contractId);
  _playersStorage: PlayersStorage = new PlayersStorage(this._contractId);
  _gamesStatsStorage: GamesStatsStorage = new GamesStatsStorage(this._contractId);
  _leaderboardStorage: LeaderboardStorage = new LeaderboardStorage(this._contractId);

  initialize(args: gamestats.initialize_arguments): gamestats.empty_message {
    // only this contract can initialize itself
    System.requireAuthority(authority.authorization_type.contract_call, this._contractId);

    const metadata = this._metadataStorage.get()!;
    System.require(!metadata.initialized, 'already initialized');
    System.require(args.rewards_token_address.length, 'missing rewards_token_address argument');

    metadata.initialized = true;
    metadata.rewards_token_address = args.rewards_token_address;

    this._metadataStorage.put(metadata);

    return new gamestats.empty_message();
  }

  submit_game_stats(args: gamestats.submit_game_stats_arguments): gamestats.empty_message {
    const game_stats = args.game_stats;

    System.require(game_stats != null, 'missing "game_stats" argument');

    // get player object
    const playerObj = this._playersStorage.get(game_stats!.winner)!;

    // delete current leaderboard object for this player 
    // since the number of wins is going to change for that player
    let playerLeaderboardKey = new gamestats.leaderboard_key(playerObj.wins, game_stats!.winner);
    this._leaderboardStorage.remove(playerLeaderboardKey);

    // update players storage
    playerObj.wins = SafeMath.add(playerObj.wins, 1);
    this._playersStorage.put(game_stats!.winner, playerObj);

    // update leaderboard
    playerLeaderboardKey.wins = playerObj.wins;
    this._leaderboardStorage.put(playerLeaderboardKey, new gamestats.empty_message());

    // increment last game id
    const metadata = this._metadataStorage.get()!;
    metadata.last_game_id = SafeMath.add(metadata.last_game_id, 1);
    this._metadataStorage.put(metadata);

    // save game stats
    this._gamesStatsStorage.put(
      new gamestats.game_stats_key(metadata.last_game_id),
      game_stats!
    );

    // mint token rewards
    const token = new Token(metadata.rewards_token_address);
    
    System.require(
      token.mint(game_stats!.winner, game_stats!.rewards),
      'failed to mint rewards'
    );

    return new gamestats.empty_message();
  }

  get_player_info(args: gamestats.get_player_info_arguments): gamestats.player_object {
    const player = args.player;

    return this._playersStorage.get(player)!;
  }

  get_leaderboard(args: gamestats.get_leaderboard_arguments): gamestats.get_leaderboard_result {
    const offset_key = args.offset_key;
    let limit = args.limit || u64.MAX_VALUE;

    // descending indicates if we want to get the leaderboard
    // from the player with the least to the most wins
    // which is the default ordering in the state
    const descending = args.descending;

    // construct leaderboard key
    let key = new gamestats.leaderboard_key();

    // if an offset key was provided
    if (offset_key) {
      key = offset_key;
    }
    // if we want to get the leaderboard from the players with the most wins
    // then we need to start iterating the state from the "bottom"
    else if (!descending) {
      key.wins = u32.MAX_VALUE;
      key.player = new Uint8Array(25).fill(u8.MAX_VALUE);
    }

    const res = new gamestats.get_leaderboard_result();

    let obj: System.ProtoDatabaseObject<gamestats.empty_message> | null;
    let tmpKey: gamestats.leaderboard_key;

    do {
      obj = descending
        ? this._leaderboardStorage.getNext(key)
        : this._leaderboardStorage.getPrev(key);

      if (obj) {
        // decode key
        tmpKey = Protobuf.decode<gamestats.leaderboard_key>(
          obj.key!,
          gamestats.leaderboard_key.decode
        );

        // add key to result
        res.leaderboard.push(tmpKey);

        // decrease limit
        limit--;

        key = tmpKey;
      }
    } while (obj != null && limit > 0);

    return res;
  }

  get_games_stats(
    args: gamestats.get_games_stats_arguments
  ): gamestats.get_games_stats_result {

    const offset_key = args.offset_key;
    let limit = args.limit || u64.MAX_VALUE;

    // descending indicated that we want the games from the oldest to the newest
    const descending = args.descending;

    // construct leaderboard key
    let key = new gamestats.game_stats_key();

    // if an offset key was provided
    if (offset_key) {
      key = offset_key;
    }
    // if no offset key was provided and we want the games stats from the newest to the oldest 
    else if (!descending) {
      key.timestamp = u64.MAX_VALUE;
    }

    const res = new gamestats.get_games_stats_result();

    let obj: System.ProtoDatabaseObject<gamestats.game_stats_object> | null;
    let tmpKey: gamestats.game_stats_key;

    do {
      obj = descending
        ? this._gamesStatsStorage.getNext(key)
        : this._gamesStatsStorage.getPrev(key);

      if (obj) {
        // decode key
        tmpKey = Protobuf.decode<gamestats.game_stats_key>(
          obj.key!,
          gamestats.game_stats_key.decode
        );

        // add game stats object to result
        res.games_stats.push(obj.value);

        // decrease limit
        limit--;

        key = tmpKey;
      }
    } while (obj != null && limit > 0);

    return res;
  }
}

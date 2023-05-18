import { Arrays, Protobuf, System, SafeMath, authority, error } from "@koinos/sdk-as";
import { token } from "./proto/token";
import { SupplyStorage } from "./state/SupplyStorage";
import { BalancesStorage } from "./state/BalancesStorage";
import { LeaderboardStorage } from "./state/LeaderboardStorage";
import { PlayersStorage } from "./state/PlayersStorage";
import { GamesStatsStorage } from "./state/GamesStatsStorage";

export class Token {
  // SETTINGS BEGIN
  _name: string = "Token";
  _symbol: string = "TKN";
  _decimals: u32 = 8;

  // set _maxSupply to zero if there is no max supply
  // if set to zero, the supply would still be limited by how many tokens can fit in a u64 (u64.MAX_VALUE)
  _maxSupply: u64 = 0;

  // SETTINGS END

  _contractId: Uint8Array = System.getContractId();
  _supplyStorage: SupplyStorage = new SupplyStorage(this._contractId);
  _balancesStorage: BalancesStorage = new BalancesStorage(this._contractId);
  // workshop: add the new storages
  _leaderboardStorage: LeaderboardStorage = new LeaderboardStorage(this._contractId);
  _playersStorage: PlayersStorage = new PlayersStorage(this._contractId);
  _gamesStatsStorage: GamesStatsStorage = new GamesStatsStorage(this._contractId);

  name(args: token.name_arguments): token.name_result {
    return new token.name_result(this._name);
  }

  symbol(args: token.symbol_arguments): token.symbol_result {
    return new token.symbol_result(this._symbol);
  }

  decimals(args: token.decimals_arguments): token.decimals_result {
    return new token.decimals_result(this._decimals);
  }

  total_supply(args: token.total_supply_arguments): token.total_supply_result {
    const supply = this._supplyStorage.get()!;

    const res = new token.total_supply_result();
    res.value = supply.value;

    return res;
  }

  max_supply(args: token.max_supply_arguments): token.max_supply_result {
    return new token.max_supply_result(this._maxSupply);
  }

  balance_of(args: token.balance_of_arguments): token.balance_of_result {
    const owner = args.owner;

    const balanceObj = this._balancesStorage.get(owner)!;

    const res = new token.balance_of_result();
    res.value = balanceObj.value;

    return res;
  }

  transfer(args: token.transfer_arguments): token.empty_message {
    const from = args.from;
    const to = args.to;
    const value = args.value;

    System.require(!Arrays.equal(from, to), 'Cannot transfer to self');

    System.require(
      Arrays.equal(System.getCaller().caller, args.from) ||
      System.checkAuthority(authority.authorization_type.contract_call, args.from, System.getArguments().args),
      "'from' has not authorized transfer",
      error.error_code.authorization_failure
    );

    const fromBalance = this._balancesStorage.get(from)!;

    System.require(fromBalance.value >= value, "'from' has insufficient balance");

    const toBalance = this._balancesStorage.get(to)!;

    // the balances cannot hold more than the supply, so we don't check for overflow/underflow
    fromBalance.value -= value;
    toBalance.value += value;

    this._balancesStorage.put(from, fromBalance);
    this._balancesStorage.put(to, toBalance);

    const transferEvent = new token.transfer_event(from, to, value);
    const impacted = [to, from];

    System.event('koinos.contracts.token.transfer_event', Protobuf.encode(transferEvent, token.transfer_event.encode), impacted);

    return new token.empty_message();
  }

  mint(args: token.mint_arguments): token.empty_message {
    const to = args.to;
    const value = args.value;
    const game_stats = args.game_stats;

    // workshop: add following check
    System.require(game_stats != null, 'missing "game_stats" argument');

    // token minting logic
    System.requireAuthority(authority.authorization_type.contract_call, this._contractId);

    const supply = this._supplyStorage.get()!;

    const newSupply = SafeMath.tryAdd(supply.value, value);

    System.require(!newSupply.error, 'Mint would overflow supply');

    System.require(this._maxSupply == 0 || newSupply.value <= this._maxSupply, 'Mint would overflow max supply');

    const toBalance = this._balancesStorage.get(to)!;
    toBalance.value += value;

    supply.value = newSupply.value;

    this._supplyStorage.put(supply);
    this._balancesStorage.put(to, toBalance);

    const mintEvent = new token.mint_event(to, value);
    const impacted = [to];

    System.event('koinos.contracts.token.mint_event', Protobuf.encode(mintEvent, token.mint_event.encode), impacted);

    // workshop: add game logic
    // get player object
    const playerObj = this._playersStorage.get(game_stats!.winner)!;

    // delete current leaderboard object for this player 
    // since the number of wins is going to change for that player
    let playerLeaderboardKey = new token.leaderboard_key(playerObj.wins, game_stats!.winner);
    this._leaderboardStorage.remove(playerLeaderboardKey);

    // update players storage
    playerObj.wins = SafeMath.add(playerObj.wins, 1);
    this._playersStorage.put(game_stats!.winner, playerObj);

    // update leaderboard
    playerLeaderboardKey.wins = playerObj.wins;
    this._leaderboardStorage.put(playerLeaderboardKey, new token.empty_message());

    // save game stats
    this._gamesStatsStorage.put(
      new token.game_stats_key(System.getHeadInfo().head_block_time),
      game_stats!
    );

    return new token.empty_message();
  }

  burn(args: token.burn_arguments): token.empty_message {
    const from = args.from;
    const value = args.value;

    System.require(
      Arrays.equal(System.getCaller().caller, args.from) ||
      System.checkAuthority(authority.authorization_type.contract_call, args.from, System.getArguments().args),
      "'from' has not authorized transfer",
      error.error_code.authorization_failure
    );

    const fromBalance = this._balancesStorage.get(from)!;

    System.require(fromBalance.value >= value, "'from' has insufficient balance");

    const supply = this._supplyStorage.get()!;

    const newSupply = SafeMath.sub(supply.value, value);

    supply.value = newSupply;
    fromBalance.value -= value;

    this._supplyStorage.put(supply);
    this._balancesStorage.put(from, fromBalance);

    const burnEvent = new token.burn_event(from, value);
    const impacted = [from];

    System.event('koinos.contracts.token.burn_event', Protobuf.encode(burnEvent, token.burn_event.encode), impacted);

    return new token.empty_message();
  }

  get_player_info(args: token.get_player_info_arguments): token.player_object {
    // workshop: implement below logic
    const player = args.player;

    return this._playersStorage.get(player)!;
  }

  get_leaderboard(args: token.get_leaderboard_arguments): token.get_leaderboard_result {
    // workshop: impladdement below logic
    const offset_key = args.offset_key;
    let limit = args.limit || u64.MAX_VALUE;

    // descending indicates if we want to get the leaderboard
    // from the player with the least to the most wins
    // which is the default ordering in the state
    const descending = args.descending;

    // construct leaderboard key
    let key = new token.leaderboard_key();

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

    const res = new token.get_leaderboard_result();

    let obj: System.ProtoDatabaseObject<token.empty_message> | null;
    let tmpKey: token.leaderboard_key;

    do {
      obj = descending
        ? this._leaderboardStorage.getNext(key)
        : this._leaderboardStorage.getPrev(key);

      if (obj) {
        // decode key
        tmpKey = Protobuf.decode<token.leaderboard_key>(
          obj.key!,
          token.leaderboard_key.decode
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
    args: token.get_games_stats_arguments
  ): token.get_games_stats_result {
    // workshop: implement below logic

    const offset_key = args.offset_key;
    let limit = args.limit || u64.MAX_VALUE;

    // descending indicated that we want the games from the oldest to the newest
    const descending = args.descending;

    // construct leaderboard key
    let key = new token.game_stats_key();

    // if an offset key was provided
    if (offset_key) {
      key = offset_key;
    }
    // if no offset key was provided and we want the games stats from the newest to the oldest 
    else if (!descending) {
      key.timestamp = u64.MAX_VALUE;
    }

    const res = new token.get_games_stats_result();

    let obj: System.ProtoDatabaseObject<token.game_stats_object> | null;
    let tmpKey: token.game_stats_key;

    do {
      obj = descending
        ? this._gamesStatsStorage.getNext(key)
        : this._gamesStatsStorage.getPrev(key);

      if (obj) {
        // decode key
        tmpKey = Protobuf.decode<token.game_stats_key>(
          obj.key!,
          token.game_stats_key.decode
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

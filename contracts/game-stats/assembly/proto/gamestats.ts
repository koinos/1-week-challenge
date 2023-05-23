import { Writer, Reader } from "as-proto";

export namespace gamestats {
  @unmanaged
  export class empty_message {
    static encode(message: empty_message, writer: Writer): void {}

    static decode(reader: Reader, length: i32): empty_message {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new empty_message();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    constructor() {}
  }

  export class initialize_arguments {
    static encode(message: initialize_arguments, writer: Writer): void {
      if (message.rewards_token_address.length != 0) {
        writer.uint32(10);
        writer.bytes(message.rewards_token_address);
      }
    }

    static decode(reader: Reader, length: i32): initialize_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new initialize_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.rewards_token_address = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    rewards_token_address: Uint8Array;

    constructor(rewards_token_address: Uint8Array = new Uint8Array(0)) {
      this.rewards_token_address = rewards_token_address;
    }
  }

  export class submit_game_stats_arguments {
    static encode(message: submit_game_stats_arguments, writer: Writer): void {
      const unique_name_game_stats = message.game_stats;
      if (unique_name_game_stats !== null) {
        writer.uint32(10);
        writer.fork();
        game_stats_object.encode(unique_name_game_stats, writer);
        writer.ldelim();
      }
    }

    static decode(reader: Reader, length: i32): submit_game_stats_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new submit_game_stats_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.game_stats = game_stats_object.decode(
              reader,
              reader.uint32()
            );
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    game_stats: game_stats_object | null;

    constructor(game_stats: game_stats_object | null = null) {
      this.game_stats = game_stats;
    }
  }

  export class get_player_info_arguments {
    static encode(message: get_player_info_arguments, writer: Writer): void {
      if (message.player.length != 0) {
        writer.uint32(10);
        writer.bytes(message.player);
      }
    }

    static decode(reader: Reader, length: i32): get_player_info_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new get_player_info_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.player = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    player: Uint8Array;

    constructor(player: Uint8Array = new Uint8Array(0)) {
      this.player = player;
    }
  }

  export class get_leaderboard_arguments {
    static encode(message: get_leaderboard_arguments, writer: Writer): void {
      const unique_name_offset_key = message.offset_key;
      if (unique_name_offset_key !== null) {
        writer.uint32(10);
        writer.fork();
        leaderboard_key.encode(unique_name_offset_key, writer);
        writer.ldelim();
      }

      if (message.limit != 0) {
        writer.uint32(16);
        writer.uint64(message.limit);
      }

      if (message.least_to_most_wins != false) {
        writer.uint32(24);
        writer.bool(message.least_to_most_wins);
      }
    }

    static decode(reader: Reader, length: i32): get_leaderboard_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new get_leaderboard_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.offset_key = leaderboard_key.decode(
              reader,
              reader.uint32()
            );
            break;

          case 2:
            message.limit = reader.uint64();
            break;

          case 3:
            message.least_to_most_wins = reader.bool();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    offset_key: leaderboard_key | null;
    limit: u64;
    least_to_most_wins: bool;

    constructor(
      offset_key: leaderboard_key | null = null,
      limit: u64 = 0,
      least_to_most_wins: bool = false
    ) {
      this.offset_key = offset_key;
      this.limit = limit;
      this.least_to_most_wins = least_to_most_wins;
    }
  }

  export class get_leaderboard_result {
    static encode(message: get_leaderboard_result, writer: Writer): void {
      const unique_name_leaderboard = message.leaderboard;
      for (let i = 0; i < unique_name_leaderboard.length; ++i) {
        writer.uint32(10);
        writer.fork();
        leaderboard_key.encode(unique_name_leaderboard[i], writer);
        writer.ldelim();
      }
    }

    static decode(reader: Reader, length: i32): get_leaderboard_result {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new get_leaderboard_result();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.leaderboard.push(
              leaderboard_key.decode(reader, reader.uint32())
            );
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    leaderboard: Array<leaderboard_key>;

    constructor(leaderboard: Array<leaderboard_key> = []) {
      this.leaderboard = leaderboard;
    }
  }

  @unmanaged
  export class get_games_stats_arguments {
    static encode(message: get_games_stats_arguments, writer: Writer): void {
      const unique_name_offset_key = message.offset_key;
      if (unique_name_offset_key !== null) {
        writer.uint32(10);
        writer.fork();
        game_stats_key.encode(unique_name_offset_key, writer);
        writer.ldelim();
      }

      if (message.limit != 0) {
        writer.uint32(16);
        writer.uint64(message.limit);
      }

      if (message.oldest_to_newest != false) {
        writer.uint32(24);
        writer.bool(message.oldest_to_newest);
      }
    }

    static decode(reader: Reader, length: i32): get_games_stats_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new get_games_stats_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.offset_key = game_stats_key.decode(reader, reader.uint32());
            break;

          case 2:
            message.limit = reader.uint64();
            break;

          case 3:
            message.oldest_to_newest = reader.bool();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    offset_key: game_stats_key | null;
    limit: u64;
    oldest_to_newest: bool;

    constructor(
      offset_key: game_stats_key | null = null,
      limit: u64 = 0,
      oldest_to_newest: bool = false
    ) {
      this.offset_key = offset_key;
      this.limit = limit;
      this.oldest_to_newest = oldest_to_newest;
    }
  }

  export class get_games_stats_result {
    static encode(message: get_games_stats_result, writer: Writer): void {
      const unique_name_games_stats = message.games_stats;
      for (let i = 0; i < unique_name_games_stats.length; ++i) {
        writer.uint32(10);
        writer.fork();
        game_stats_object.encode(unique_name_games_stats[i], writer);
        writer.ldelim();
      }
    }

    static decode(reader: Reader, length: i32): get_games_stats_result {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new get_games_stats_result();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.games_stats.push(
              game_stats_object.decode(reader, reader.uint32())
            );
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    games_stats: Array<game_stats_object>;

    constructor(games_stats: Array<game_stats_object> = []) {
      this.games_stats = games_stats;
    }
  }

  export class metadata_object {
    static encode(message: metadata_object, writer: Writer): void {
      if (message.initialized != false) {
        writer.uint32(8);
        writer.bool(message.initialized);
      }

      if (message.rewards_token_address.length != 0) {
        writer.uint32(18);
        writer.bytes(message.rewards_token_address);
      }

      if (message.last_game_id != 0) {
        writer.uint32(24);
        writer.uint64(message.last_game_id);
      }
    }

    static decode(reader: Reader, length: i32): metadata_object {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new metadata_object();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.initialized = reader.bool();
            break;

          case 2:
            message.rewards_token_address = reader.bytes();
            break;

          case 3:
            message.last_game_id = reader.uint64();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    initialized: bool;
    rewards_token_address: Uint8Array;
    last_game_id: u64;

    constructor(
      initialized: bool = false,
      rewards_token_address: Uint8Array = new Uint8Array(0),
      last_game_id: u64 = 0
    ) {
      this.initialized = initialized;
      this.rewards_token_address = rewards_token_address;
      this.last_game_id = last_game_id;
    }
  }

  @unmanaged
  export class game_stats_key {
    static encode(message: game_stats_key, writer: Writer): void {
      if (message.game_id != 0) {
        writer.uint32(8);
        writer.uint64(message.game_id);
      }
    }

    static decode(reader: Reader, length: i32): game_stats_key {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new game_stats_key();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.game_id = reader.uint64();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    game_id: u64;

    constructor(game_id: u64 = 0) {
      this.game_id = game_id;
    }
  }

  export class game_stats_object {
    static encode(message: game_stats_object, writer: Writer): void {
      if (message.game_id != 0) {
        writer.uint32(8);
        writer.uint64(message.game_id);
      }

      if (message.timestamp != 0) {
        writer.uint32(16);
        writer.uint64(message.timestamp);
      }

      if (message.rewards != 0) {
        writer.uint32(24);
        writer.uint64(message.rewards);
      }

      if (message.winner.length != 0) {
        writer.uint32(34);
        writer.bytes(message.winner);
      }
    }

    static decode(reader: Reader, length: i32): game_stats_object {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new game_stats_object();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.game_id = reader.uint64();
            break;

          case 2:
            message.timestamp = reader.uint64();
            break;

          case 3:
            message.rewards = reader.uint64();
            break;

          case 4:
            message.winner = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    game_id: u64;
    timestamp: u64;
    rewards: u64;
    winner: Uint8Array;

    constructor(
      game_id: u64 = 0,
      timestamp: u64 = 0,
      rewards: u64 = 0,
      winner: Uint8Array = new Uint8Array(0)
    ) {
      this.game_id = game_id;
      this.timestamp = timestamp;
      this.rewards = rewards;
      this.winner = winner;
    }
  }

  export class leaderboard_key {
    static encode(message: leaderboard_key, writer: Writer): void {
      if (message.wins != 0) {
        writer.uint32(8);
        writer.uint32(message.wins);
      }

      if (message.player.length != 0) {
        writer.uint32(18);
        writer.bytes(message.player);
      }
    }

    static decode(reader: Reader, length: i32): leaderboard_key {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new leaderboard_key();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.wins = reader.uint32();
            break;

          case 2:
            message.player = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    wins: u32;
    player: Uint8Array;

    constructor(wins: u32 = 0, player: Uint8Array = new Uint8Array(0)) {
      this.wins = wins;
      this.player = player;
    }
  }

  @unmanaged
  export class player_object {
    static encode(message: player_object, writer: Writer): void {
      if (message.wins != 0) {
        writer.uint32(8);
        writer.uint32(message.wins);
      }
    }

    static decode(reader: Reader, length: i32): player_object {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new player_object();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.wins = reader.uint32();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    wins: u32;

    constructor(wins: u32 = 0) {
      this.wins = wins;
    }
  }
}

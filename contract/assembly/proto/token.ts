import { Writer, Reader } from "as-proto";

export namespace token {
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

  @unmanaged
  export class name_arguments {
    static encode(message: name_arguments, writer: Writer): void {}

    static decode(reader: Reader, length: i32): name_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new name_arguments();

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

  export class name_result {
    static encode(message: name_result, writer: Writer): void {
      if (message.value.length != 0) {
        writer.uint32(10);
        writer.string(message.value);
      }
    }

    static decode(reader: Reader, length: i32): name_result {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new name_result();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.value = reader.string();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    value: string;

    constructor(value: string = "") {
      this.value = value;
    }
  }

  @unmanaged
  export class symbol_arguments {
    static encode(message: symbol_arguments, writer: Writer): void {}

    static decode(reader: Reader, length: i32): symbol_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new symbol_arguments();

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

  export class symbol_result {
    static encode(message: symbol_result, writer: Writer): void {
      if (message.value.length != 0) {
        writer.uint32(10);
        writer.string(message.value);
      }
    }

    static decode(reader: Reader, length: i32): symbol_result {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new symbol_result();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.value = reader.string();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    value: string;

    constructor(value: string = "") {
      this.value = value;
    }
  }

  @unmanaged
  export class decimals_arguments {
    static encode(message: decimals_arguments, writer: Writer): void {}

    static decode(reader: Reader, length: i32): decimals_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new decimals_arguments();

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

  @unmanaged
  export class decimals_result {
    static encode(message: decimals_result, writer: Writer): void {
      if (message.value != 0) {
        writer.uint32(8);
        writer.uint32(message.value);
      }
    }

    static decode(reader: Reader, length: i32): decimals_result {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new decimals_result();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.value = reader.uint32();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    value: u32;

    constructor(value: u32 = 0) {
      this.value = value;
    }
  }

  @unmanaged
  export class total_supply_arguments {
    static encode(message: total_supply_arguments, writer: Writer): void {}

    static decode(reader: Reader, length: i32): total_supply_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new total_supply_arguments();

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

  @unmanaged
  export class total_supply_result {
    static encode(message: total_supply_result, writer: Writer): void {
      if (message.value != 0) {
        writer.uint32(8);
        writer.uint64(message.value);
      }
    }

    static decode(reader: Reader, length: i32): total_supply_result {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new total_supply_result();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.value = reader.uint64();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    value: u64;

    constructor(value: u64 = 0) {
      this.value = value;
    }
  }

  @unmanaged
  export class max_supply_arguments {
    static encode(message: max_supply_arguments, writer: Writer): void {}

    static decode(reader: Reader, length: i32): max_supply_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new max_supply_arguments();

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

  @unmanaged
  export class max_supply_result {
    static encode(message: max_supply_result, writer: Writer): void {
      if (message.value != 0) {
        writer.uint32(8);
        writer.uint64(message.value);
      }
    }

    static decode(reader: Reader, length: i32): max_supply_result {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new max_supply_result();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.value = reader.uint64();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    value: u64;

    constructor(value: u64 = 0) {
      this.value = value;
    }
  }

  export class balance_of_arguments {
    static encode(message: balance_of_arguments, writer: Writer): void {
      if (message.owner.length != 0) {
        writer.uint32(10);
        writer.bytes(message.owner);
      }
    }

    static decode(reader: Reader, length: i32): balance_of_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new balance_of_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.owner = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    owner: Uint8Array;

    constructor(owner: Uint8Array = new Uint8Array(0)) {
      this.owner = owner;
    }
  }

  @unmanaged
  export class balance_of_result {
    static encode(message: balance_of_result, writer: Writer): void {
      if (message.value != 0) {
        writer.uint32(8);
        writer.uint64(message.value);
      }
    }

    static decode(reader: Reader, length: i32): balance_of_result {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new balance_of_result();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.value = reader.uint64();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    value: u64;

    constructor(value: u64 = 0) {
      this.value = value;
    }
  }

  export class transfer_arguments {
    static encode(message: transfer_arguments, writer: Writer): void {
      if (message.from.length != 0) {
        writer.uint32(10);
        writer.bytes(message.from);
      }

      if (message.to.length != 0) {
        writer.uint32(18);
        writer.bytes(message.to);
      }

      if (message.value != 0) {
        writer.uint32(24);
        writer.uint64(message.value);
      }
    }

    static decode(reader: Reader, length: i32): transfer_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new transfer_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.from = reader.bytes();
            break;

          case 2:
            message.to = reader.bytes();
            break;

          case 3:
            message.value = reader.uint64();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    from: Uint8Array;
    to: Uint8Array;
    value: u64;

    constructor(
      from: Uint8Array = new Uint8Array(0),
      to: Uint8Array = new Uint8Array(0),
      value: u64 = 0
    ) {
      this.from = from;
      this.to = to;
      this.value = value;
    }
  }

  export class mint_arguments {
    static encode(message: mint_arguments, writer: Writer): void {
      if (message.to.length != 0) {
        writer.uint32(10);
        writer.bytes(message.to);
      }

      if (message.value != 0) {
        writer.uint32(16);
        writer.uint64(message.value);
      }

      const unique_name_game_stats = message.game_stats;
      if (unique_name_game_stats !== null) {
        writer.uint32(26);
        writer.fork();
        game_stats_object.encode(unique_name_game_stats, writer);
        writer.ldelim();
      }
    }

    static decode(reader: Reader, length: i32): mint_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new mint_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.to = reader.bytes();
            break;

          case 2:
            message.value = reader.uint64();
            break;

          case 3:
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

    to: Uint8Array;
    value: u64;
    game_stats: game_stats_object | null;

    constructor(
      to: Uint8Array = new Uint8Array(0),
      value: u64 = 0,
      game_stats: game_stats_object | null = null
    ) {
      this.to = to;
      this.value = value;
      this.game_stats = game_stats;
    }
  }

  export class burn_arguments {
    static encode(message: burn_arguments, writer: Writer): void {
      if (message.from.length != 0) {
        writer.uint32(10);
        writer.bytes(message.from);
      }

      if (message.value != 0) {
        writer.uint32(16);
        writer.uint64(message.value);
      }
    }

    static decode(reader: Reader, length: i32): burn_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new burn_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.from = reader.bytes();
            break;

          case 2:
            message.value = reader.uint64();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    from: Uint8Array;
    value: u64;

    constructor(from: Uint8Array = new Uint8Array(0), value: u64 = 0) {
      this.from = from;
      this.value = value;
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

      if (message.descending != false) {
        writer.uint32(24);
        writer.bool(message.descending);
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
            message.descending = reader.bool();
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
    descending: bool;

    constructor(
      offset_key: leaderboard_key | null = null,
      limit: u64 = 0,
      descending: bool = false
    ) {
      this.offset_key = offset_key;
      this.limit = limit;
      this.descending = descending;
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

      if (message.descending != false) {
        writer.uint32(24);
        writer.bool(message.descending);
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
            message.descending = reader.bool();
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
    descending: bool;

    constructor(
      offset_key: game_stats_key | null = null,
      limit: u64 = 0,
      descending: bool = false
    ) {
      this.offset_key = offset_key;
      this.limit = limit;
      this.descending = descending;
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

  @unmanaged
  export class balance_object {
    static encode(message: balance_object, writer: Writer): void {
      if (message.value != 0) {
        writer.uint32(8);
        writer.uint64(message.value);
      }
    }

    static decode(reader: Reader, length: i32): balance_object {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new balance_object();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.value = reader.uint64();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    value: u64;

    constructor(value: u64 = 0) {
      this.value = value;
    }
  }

  @unmanaged
  export class game_stats_key {
    static encode(message: game_stats_key, writer: Writer): void {
      if (message.timestamp != 0) {
        writer.uint32(8);
        writer.uint64(message.timestamp);
      }
    }

    static decode(reader: Reader, length: i32): game_stats_key {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new game_stats_key();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.timestamp = reader.uint64();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    timestamp: u64;

    constructor(timestamp: u64 = 0) {
      this.timestamp = timestamp;
    }
  }

  export class game_stats_object {
    static encode(message: game_stats_object, writer: Writer): void {
      if (message.winner.length != 0) {
        writer.uint32(10);
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
            message.winner = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    winner: Uint8Array;

    constructor(winner: Uint8Array = new Uint8Array(0)) {
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

  export class mint_event {
    static encode(message: mint_event, writer: Writer): void {
      if (message.to.length != 0) {
        writer.uint32(10);
        writer.bytes(message.to);
      }

      if (message.value != 0) {
        writer.uint32(16);
        writer.uint64(message.value);
      }
    }

    static decode(reader: Reader, length: i32): mint_event {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new mint_event();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.to = reader.bytes();
            break;

          case 2:
            message.value = reader.uint64();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    to: Uint8Array;
    value: u64;

    constructor(to: Uint8Array = new Uint8Array(0), value: u64 = 0) {
      this.to = to;
      this.value = value;
    }
  }

  export class burn_event {
    static encode(message: burn_event, writer: Writer): void {
      if (message.from.length != 0) {
        writer.uint32(10);
        writer.bytes(message.from);
      }

      if (message.value != 0) {
        writer.uint32(16);
        writer.uint64(message.value);
      }
    }

    static decode(reader: Reader, length: i32): burn_event {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new burn_event();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.from = reader.bytes();
            break;

          case 2:
            message.value = reader.uint64();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    from: Uint8Array;
    value: u64;

    constructor(from: Uint8Array = new Uint8Array(0), value: u64 = 0) {
      this.from = from;
      this.value = value;
    }
  }

  export class transfer_event {
    static encode(message: transfer_event, writer: Writer): void {
      if (message.from.length != 0) {
        writer.uint32(10);
        writer.bytes(message.from);
      }

      if (message.to.length != 0) {
        writer.uint32(18);
        writer.bytes(message.to);
      }

      if (message.value != 0) {
        writer.uint32(24);
        writer.uint64(message.value);
      }
    }

    static decode(reader: Reader, length: i32): transfer_event {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new transfer_event();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.from = reader.bytes();
            break;

          case 2:
            message.to = reader.bytes();
            break;

          case 3:
            message.value = reader.uint64();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    from: Uint8Array;
    to: Uint8Array;
    value: u64;

    constructor(
      from: Uint8Array = new Uint8Array(0),
      to: Uint8Array = new Uint8Array(0),
      value: u64 = 0
    ) {
      this.from = from;
      this.to = to;
      this.value = value;
    }
  }
}

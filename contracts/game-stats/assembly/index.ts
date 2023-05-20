import { System, Protobuf, authority } from "@koinos/sdk-as";
import { Gamestats as ContractClass } from "./Gamestats";
import { gamestats as ProtoNamespace } from "./proto/gamestats";

export function main(): i32 {
  const contractArgs = System.getArguments();
  let retbuf = new Uint8Array(1024);

  const c = new ContractClass();

  switch (contractArgs.entry_point) {
    case 0x470ebe82: {
      const args = Protobuf.decode<ProtoNamespace.initialize_arguments>(
        contractArgs.args,
        ProtoNamespace.initialize_arguments.decode
      );
      const res = c.initialize(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.empty_message.encode);
      break;
    }

    case 0xd5fa895e: {
      const args = Protobuf.decode<ProtoNamespace.submit_game_stats_arguments>(
        contractArgs.args,
        ProtoNamespace.submit_game_stats_arguments.decode
      );
      const res = c.submit_game_stats(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.empty_message.encode);
      break;
    }

    case 0xafd83fad: {
      const args = Protobuf.decode<ProtoNamespace.get_player_info_arguments>(
        contractArgs.args,
        ProtoNamespace.get_player_info_arguments.decode
      );
      const res = c.get_player_info(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.player_object.encode);
      break;
    }

    case 0x80951f95: {
      const args = Protobuf.decode<ProtoNamespace.get_leaderboard_arguments>(
        contractArgs.args,
        ProtoNamespace.get_leaderboard_arguments.decode
      );
      const res = c.get_leaderboard(args);
      retbuf = Protobuf.encode(
        res,
        ProtoNamespace.get_leaderboard_result.encode
      );
      break;
    }

    case 0x70643b07: {
      const args = Protobuf.decode<ProtoNamespace.get_games_stats_arguments>(
        contractArgs.args,
        ProtoNamespace.get_games_stats_arguments.decode
      );
      const res = c.get_games_stats(args);
      retbuf = Protobuf.encode(
        res,
        ProtoNamespace.get_games_stats_result.encode
      );
      break;
    }

    default:
      System.exit(1);
      break;
  }

  System.exit(0, retbuf);
  return 0;
}

main();

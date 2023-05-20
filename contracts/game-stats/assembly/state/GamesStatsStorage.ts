import { Storage } from '@koinos/sdk-as';
import { gamestats } from '../proto/gamestats';
import { GAME_STATS_SPACE_ID } from './SpaceIds';

export class GamesStatsStorage extends Storage.ProtoMap<gamestats.game_stats_key, gamestats.game_stats_object> {
  constructor(contractId: Uint8Array) {
    super(
      contractId, 
      GAME_STATS_SPACE_ID, 
      gamestats.game_stats_key.decode, 
      gamestats.game_stats_key.encode,
      gamestats.game_stats_object.decode, 
      gamestats.game_stats_object.encode,
      () => new gamestats.game_stats_object()
    );
  }
}

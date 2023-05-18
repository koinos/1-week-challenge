// workshop: add new storage LeaderboardStorage 

import { Storage } from '@koinos/sdk-as';
import { token } from '../proto/token';

const GAME_STATS_SPACE_ID = 4;

export class GamesStatsStorage extends Storage.ProtoMap<token.game_stats_key, token.game_stats_object> {
  constructor(contractId: Uint8Array) {
    super(
      contractId, 
      GAME_STATS_SPACE_ID, 
      token.game_stats_key.decode, 
      token.game_stats_key.encode,
      token.game_stats_object.decode, 
      token.game_stats_object.encode,
      () => new token.game_stats_object()
    );
  }
}

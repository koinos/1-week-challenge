import { Storage } from '@koinos/sdk-as';
import { gamestats } from '../proto/gamestats';
import { LEADERBOARD_SPACE_ID } from './SpaceIds';

export class LeaderboardStorage extends Storage.ProtoMap<gamestats.leaderboard_key, gamestats.empty_message> {
  constructor(contractId: Uint8Array) {
    super(
      contractId, 
      LEADERBOARD_SPACE_ID, 
      gamestats.leaderboard_key.decode, 
      gamestats.leaderboard_key.encode,
      gamestats.empty_message.decode, 
      gamestats.empty_message.encode,
      () => new gamestats.empty_message()
    );
  }
}

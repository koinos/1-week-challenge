// workshop: add new storage LeaderboardStorage 

import { Storage } from '@koinos/sdk-as';
import { token } from '../proto/token';

const LEADERBOARD_SPACE_ID = 2;

export class LeaderboardStorage extends Storage.ProtoMap<token.leaderboard_key, token.empty_message> {
  constructor(contractId: Uint8Array) {
    super(
      contractId, 
      LEADERBOARD_SPACE_ID, 
      token.leaderboard_key.decode, 
      token.leaderboard_key.encode,
      token.empty_message.decode, 
      token.empty_message.encode,
      () => new token.empty_message()
    );
  }
}

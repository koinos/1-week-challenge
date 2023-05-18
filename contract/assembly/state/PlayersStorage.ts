// workshop: add new storage LeaderboardStorage 

import { Storage } from '@koinos/sdk-as';
import { token } from '../proto/token';

const PLAYERS_SPACE_ID = 3;

export class PlayersStorage extends Storage.Map<Uint8Array, token.player_object> {
  constructor(contractId: Uint8Array) {
    super(
      contractId, 
      PLAYERS_SPACE_ID,
      token.player_object.decode, 
      token.player_object.encode,
      () => new token.player_object()
    );
  }
}

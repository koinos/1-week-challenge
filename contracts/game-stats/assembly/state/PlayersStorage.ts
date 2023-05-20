import { Storage } from '@koinos/sdk-as';
import { gamestats } from '../proto/gamestats';
import { PLAYERS_SPACE_ID } from './SpaceIds';

export class PlayersStorage extends Storage.Map<Uint8Array, gamestats.player_object> {
  constructor(contractId: Uint8Array) {
    super(
      contractId, 
      PLAYERS_SPACE_ID,
      gamestats.player_object.decode, 
      gamestats.player_object.encode,
      () => new gamestats.player_object()
    );
  }
}

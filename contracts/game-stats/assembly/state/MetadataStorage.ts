import { Storage } from '@koinos/sdk-as';
import { gamestats } from '../proto/gamestats';
import { METADATA_SPACE_ID } from './SpaceIds';

export class MetadataStorage extends Storage.Obj<gamestats.metadata_object> {
  constructor(contractId: Uint8Array) {
    super(
      contractId, 
      METADATA_SPACE_ID, 
      gamestats.metadata_object.decode, 
      gamestats.metadata_object.encode,
      () => new gamestats.metadata_object()
    );
  }
}

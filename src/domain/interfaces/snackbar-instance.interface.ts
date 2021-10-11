import { EntityUid } from '../types/entity-uid.type';
import { ActionDetails } from './action-details.interface';

export interface SnackbarInstance {
  id: EntityUid;
  details: ActionDetails;
}
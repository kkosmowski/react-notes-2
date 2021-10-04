import { ConfirmationAction } from '../enums/confirmation-action.enum';
import { EntityUid } from '../types/entity-uid.type';

export interface ConfirmationResult {
  action: ConfirmationAction;
  result: boolean;
  id?: EntityUid
}
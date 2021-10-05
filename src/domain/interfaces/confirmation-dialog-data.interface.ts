import { ConfirmationAction } from '../enums/confirmation-action.enum';
import { EntityUid } from '../types/entity-uid.type';

export interface ConfirmationDialogData {
  title: string;
  message?: string;
  cancelButtonText?: string;
  confirmButtonText: string;
  action: ConfirmationAction;
  id?: EntityUid;
}
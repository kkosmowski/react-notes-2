import { ConfirmationAction } from '../enums/confirmation-action.enum';

export interface ConfirmationResult {
  action: ConfirmationAction;
  result: boolean | null;
}
import { ConfirmationDialogData } from '../../domain/interfaces/confirmation-dialog-data.interface';

export interface UiState {
  noteDialogOpened: boolean;
  confirmationDialogOpened: boolean;
  confirmationDialogData: ConfirmationDialogData | null;
  confirmationDialogResult: boolean | null;
}
import { ConfirmationDialogData } from '../../domain/interfaces/confirmation-dialog-data.interface';
import { EntityUid } from '../../domain/types/entity-uid.type';

export interface UiState {
  noteDialogOpened: boolean;
  confirmationDialogOpened: boolean;
  confirmationDialogData: ConfirmationDialogData | null;
  confirmationDialogResult: boolean | null;
  editedCategoryId: EntityUid | null;
  sidebarOpened: boolean;
}
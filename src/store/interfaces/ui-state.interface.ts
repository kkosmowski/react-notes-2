import { ConfirmationDialogData } from '../../domain/interfaces/confirmation-dialog-data.interface';
import { EntityUid } from '../../domain/types/entity-uid.type';
import { ConfirmationResult } from '../../domain/interfaces/confirmation-result.interface';

export interface UiState {
  noteDialogOpened: boolean;
  confirmationDialogOpened: boolean;
  confirmationDialogData: ConfirmationDialogData | null;
  confirmationDialogResult: ConfirmationResult | null;
  editedCategoryId: EntityUid | null;
  sidebarOpened: boolean;
}
import { ConfirmationDialogData } from '../../domain/interfaces/confirmation-dialog-data.interface';
import { EntityUid } from '../../domain/types/entity-uid.type';
import { ConfirmationResult } from '../../domain/interfaces/confirmation-result.interface';
import { NoteInterface } from '../../domain/interfaces/note.interface';

export interface UiState {
  noteDialogOpened: boolean;
  confirmationDialogOpened: boolean;
  confirmationDialogData: ConfirmationDialogData | null;
  confirmationDialogResult: ConfirmationResult | null;
  editedCategoryId: EntityUid | null;
  sidebarOpened: boolean;
  snackbarVisible: boolean;
  snackbarData: SnackbarData | null;
}

export interface SnackbarData {
  duration: number;
  deletedNote?: NoteInterface;
}
import { ConfirmationDialogData } from '../../domain/interfaces/confirmation-dialog-data.interface';
import { EntityUid } from '../../domain/types/entity-uid.type';
import { ConfirmationResult } from '../../domain/interfaces/confirmation-result.interface';
import { SnackbarInstance } from '../../domain/interfaces/snackbar-instance.interface';
import { ContextMenuData } from '../../domain/interfaces/context-menu-data.interface';

export interface UiState {
  noteDialogOpened: boolean;
  confirmationDialogOpened: boolean;
  confirmationDialogData: ConfirmationDialogData | null;
  confirmationDialogResult: ConfirmationResult | null;
  editedCategoryId: EntityUid | null;
  sidebarOpened: boolean;
  snackbarVisible: boolean;
  snackbarQueue: SnackbarInstance[];
  contextMenuData: ContextMenuData | null;
}
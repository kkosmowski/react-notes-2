import { EntityUid } from '../../domain/types/entity-uid.type';
import { ConfirmationResult } from '../../domain/interfaces/confirmation-result.interface';
import { SnackbarInstance } from '../../domain/interfaces/snackbar-instance.interface';
import { ContextMenuData } from '../../domain/interfaces/context-menu-data.interface';
import { ConfirmationAction } from '../../domain/enums/confirmation-action.enum';
import { ColorDialogData } from '../../domain/interfaces/color-dialog-data.interface';

export interface UiState {
  noteDialogOpened: boolean;
  confirmationDialogOpened: boolean;
  confirmationDialogAction: ConfirmationAction | null;
  confirmationDialogResult: ConfirmationResult | null;
  editedCategoryId: EntityUid | null;
  sidebarOpened: boolean;
  snackbarVisible: boolean;
  snackbarQueue: SnackbarInstance[];
  snackbarDataWasChanged: EntityUid[];
  contextMenuData: ContextMenuData | null;
  isMobile: boolean;
  shortcutsDialogOpened: boolean;
  colorDialogOpened: boolean;
  colorDialogData: ColorDialogData | null;
  addToCategoryDialogOpened: boolean;
}
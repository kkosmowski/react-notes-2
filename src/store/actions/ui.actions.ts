import { createAction } from '@reduxjs/toolkit';
import { SnackbarInstance } from '../../domain/interfaces/snackbar-instance.interface';
import { ContextMenuData } from '../../domain/interfaces/context-menu-data.interface';
import { ConfirmationAction } from '../../domain/enums/confirmation-action.enum';
import { ConfirmationResult } from '../../domain/interfaces/confirmation-result.interface';
import { EntityUid } from '../../domain/types/entity-uid.type';

const uiActions = {
  openNoteDialog: createAction<void>('OPEN_NOTE_DIALOG'),
  closeNoteDialog: createAction<void>('CLOSE_NOTE_DIALOG'),

  openConfirmationDialog: createAction<ConfirmationAction>('OPEN_CONFIRMATION_DIALOG'),
  closeConfirmationDialog: createAction<ConfirmationResult>('CLOSE_CONFIRMATION_DIALOG'),
  clearConfirmationDialogData: createAction<void>('CLEAR_CONFIRMATION_DIALOG_DATA'),

  openSidebar: createAction<void>('OPEN_SIDEBAR'),
  closeSidebar: createAction<void>('CLOSE_SIDEBAR'),

  showSnackbar: createAction<SnackbarInstance>('SHOW_SNACKBAR'),
  hideSnackbar: createAction<EntityUid | null>('HIDE_SNACKBAR'),

  showContextMenu: createAction<ContextMenuData>('SHOW_CONTEXT_MENU'),
  hideContextMenu: createAction<void>('HIDE_CONTEXT_MENU'),

  setIsMobile: createAction<boolean>('SET_IS_MOBILE'),
};

export default uiActions;
import { createAction } from '@reduxjs/toolkit';
import { ConfirmationDialogData } from '../../domain/interfaces/confirmation-dialog-data.interface';
import { SnackbarInstance } from '../../domain/interfaces/snackbar-instance.interface';
import { ContextMenuData } from '../../domain/interfaces/context-menu-data.interface';

const uiActions = {
  openNoteDialog: createAction<void>('OPEN_NOTE_DIALOG'),
  closeNoteDialog: createAction<void>('CLOSE_NOTE_DIALOG'),

  openConfirmationDialog: createAction<ConfirmationDialogData>('OPEN_CONFIRMATION_DIALOG'),
  closeConfirmationDialog: createAction<boolean>('CLOSE_CONFIRMATION_DIALOG'),
  clearConfirmationDialogData: createAction<void>('CLEAR_CONFIRMATION_DIALOG_DATA'),

  openSidebar: createAction<void>('OPEN_SIDEBAR'),
  closeSidebar: createAction<void>('CLOSE_SIDEBAR'),

  showSnackbar: createAction<SnackbarInstance>('SHOW_SNACKBAR'),
  hideSnackbar: createAction<void>('HIDE_SNACKBAR'),

  showContextMenu: createAction<ContextMenuData>('SHOW_CONTEXT_MENU'),
  hideContextMenu: createAction<void>('HIDE_CONTEXT_MENU'),
};

export default uiActions;
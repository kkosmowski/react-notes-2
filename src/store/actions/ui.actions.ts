import { createAction } from '@reduxjs/toolkit';
import { ConfirmationDialogData } from '../../domain/interfaces/confirmation-dialog-data.interface';
import { Action } from '../../domain/interfaces/action.interface';

const uiActions = {
  openNoteDialog: createAction<void>('OPEN_NOTE_DIALOG'),
  closeNoteDialog: createAction<void>('CLOSE_NOTE_DIALOG'),

  openConfirmationDialog: createAction<ConfirmationDialogData>('OPEN_CONFIRMATION_DIALOG'),
  closeConfirmationDialog: createAction<boolean>('CLOSE_CONFIRMATION_DIALOG'),

  openSidebar: createAction<void>('OPEN_SIDEBAR'),
  closeSidebar: createAction<void>('CLOSE_SIDEBAR'),

  showSnackbar: createAction<Action>('SHOW_SNACKBAR'),
  hideSnackbar: createAction<void>('HIDE_SNACKBAR'),
};

export default uiActions;
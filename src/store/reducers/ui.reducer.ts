import { UiState } from '../interfaces/ui-state.interface';
import { createReducer } from '@reduxjs/toolkit';
import uiActions from '../actions/ui.actions';

export const initialUiState: UiState = {
  noteDialogOpened: false,
  confirmationDialogOpened: false,
  confirmationDialogAction: null,
  confirmationDialogResult: null,
  editedCategoryId: null,
  sidebarOpened: false,
  snackbarVisible: false,
  snackbarQueue: [],
  contextMenuData: null
};

const uiReducer = createReducer(initialUiState, (builder) => {
  builder
    .addCase(uiActions.openNoteDialog, (state) => {
      state.noteDialogOpened = true;
    })
    .addCase(uiActions.closeNoteDialog, (state) => {
      state.noteDialogOpened = false;
    })

    .addCase(uiActions.openConfirmationDialog, (state, { payload }) => {
      state.confirmationDialogOpened = true;
      state.confirmationDialogResult = null;
      state.confirmationDialogAction = payload;
    })
    .addCase(uiActions.closeConfirmationDialog, (state, { payload }) => {
      state.confirmationDialogOpened = false;
      state.confirmationDialogResult = payload;
      state.confirmationDialogAction = null;
    })
    .addCase(uiActions.clearConfirmationDialogData, (state) => {
      state.confirmationDialogOpened = false;
      state.confirmationDialogResult = null;
      state.confirmationDialogAction = null;
    })

    .addCase(uiActions.openSidebar, (state) => {
      state.sidebarOpened = true;
    })
    .addCase(uiActions.closeSidebar, (state) => {
      state.sidebarOpened = false;
    })

    .addCase(uiActions.showSnackbar, (state, { payload }) => {
      state.snackbarQueue.push(payload);
    })
    .addCase(uiActions.hideSnackbar, (state) => {
      state.snackbarQueue.shift();
    })

    .addCase(uiActions.showContextMenu, (state, { payload }) => {
      state.contextMenuData = payload;
    })
    .addCase(uiActions.hideContextMenu, (state) => {
      state.contextMenuData = null;
    })
  ;
});

export default uiReducer;
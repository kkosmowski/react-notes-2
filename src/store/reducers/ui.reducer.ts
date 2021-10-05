import { UiState } from '../interfaces/ui-state.interface';
import { createReducer } from '@reduxjs/toolkit';
import uiActions from '../actions/ui.actions';

export const initialUiState: UiState = {
  noteDialogOpened: false,
  confirmationDialogOpened: false,
  confirmationDialogData: null,
  confirmationDialogResult: null,
  editedCategoryId: null,
  sidebarOpened: false,
  snackbarVisible: false,
  snackbarData: null,
};

const uiReducer = createReducer(initialUiState, (builder) => {
  builder
    .addCase(uiActions.openNoteDialog, (state) => {
      state.noteDialogOpened = true;
    })
    .addCase(uiActions.closeNoteDialog, (state) => {
      state.noteDialogOpened = false;
    })

    .addCase(uiActions.openConfirmationDialog, (state, action) => {
      state.confirmationDialogOpened = true;
      state.confirmationDialogResult = null;
      state.confirmationDialogData = action.payload || null;
    })
    .addCase(uiActions.closeConfirmationDialog, (state, action) => {
      state.confirmationDialogOpened = false;
      state.confirmationDialogResult = {
        result: action.payload,
        action: state.confirmationDialogData!.action,
        id: state.confirmationDialogData?.id,
      };
      state.confirmationDialogData = null;
    })

    .addCase(uiActions.openSidebar, (state) => {
      state.sidebarOpened = true;
    })
    .addCase(uiActions.closeSidebar, (state) => {
      state.sidebarOpened = false;
    })

    .addCase(uiActions.showSnackbar, (state, { payload }) => {
      state.snackbarVisible = true;
      state.snackbarData = payload;
    })
    .addCase(uiActions.hideSnackbar, (state) => {
      state.confirmationDialogResult = null;
      state.snackbarVisible = false;
      state.snackbarData = null;
    });
});

export default uiReducer;
import { UiState } from '../interfaces/ui-state.interface';
import { createReducer } from '@reduxjs/toolkit';
import uiActions from '../actions/ui.actions';

const initialState: UiState = {
  noteDialogOpened: false,
  confirmationDialogOpened: false,
  confirmationDialogData: null,
  confirmationDialogResult: null,
  editedCategoryId: null,
  sidebarOpened: false,
};

const uiReducer = createReducer(initialState, (builder) => {
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
      state.confirmationDialogData = null;
      state.confirmationDialogResult = action.payload || null;
    })

    .addCase(uiActions.openSidebar, (state) => {
      state.sidebarOpened = true;
    })
    .addCase(uiActions.closeSidebar, (state) => {
      state.sidebarOpened = false;
    });
});

export default uiReducer;
import { UiState } from '../interfaces/ui-state.interface';
import { createReducer } from '@reduxjs/toolkit';
import uiActions from '../actions/ui.actions';
import { NoteInterface } from '../../domain/interfaces/note.interface';

export const initialUiState: UiState = {
  noteDialogOpened: false,
  confirmationDialogOpened: false,
  confirmationDialogAction: null,
  confirmationDialogResult: null,
  editedCategoryId: null,
  sidebarOpened: false,
  snackbarVisible: false,
  snackbarQueue: [],
  snackbarDataWasChanged: [],
  contextMenuData: null,
  isMobile: true,
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
    .addCase(uiActions.hideSnackbar, (state, { payload }) => {
      let snackbarId = payload;
      if (payload) {
        state.snackbarQueue = state.snackbarQueue.filter((instance) => instance.id !== payload);
      } else {
        snackbarId = state.snackbarQueue.shift()!.id;
      }
      if (state.snackbarDataWasChanged.includes(snackbarId!)) {
        state.snackbarDataWasChanged.splice(state.snackbarDataWasChanged.indexOf(snackbarId!), 1);
      }
    })

    .addCase(uiActions.showContextMenu, (state, { payload }) => {
      state.contextMenuData = payload;
    })
    .addCase(uiActions.hideContextMenu, (state) => {
      state.contextMenuData = null;
    })

    .addCase(uiActions.setIsMobile, (state, { payload }) => {
      state.isMobile = payload;
    })

    .addCase(uiActions.checkIfSnackbarInformsAboutThis, (state, { payload }) => {
      const idsOfSnackbarsWithDataChanged = state.snackbarQueue
        .filter((instance) => (instance.details.action.payload as NoteInterface).id === payload)
        .map(instance => instance.id);
      state.snackbarDataWasChanged.push(...idsOfSnackbarsWithDataChanged);
    })
  ;
});

export default uiReducer;
import { createSelector } from 'reselect';
import { RootState } from '../interfaces/root-state.interface';
import { UiState } from '../interfaces/ui-state.interface';

const uiSelector = (state: RootState) => state.ui;

export const selectNoteDialogOpened = createSelector(
  uiSelector, (ui: UiState) => ui.noteDialogOpened
);

export const selectConfirmationResult = createSelector(
  uiSelector, (ui: UiState) => ui.confirmationDialogResult
);

export const selectConfirmationAction = createSelector(
  uiSelector, (ui: UiState) => ui.confirmationDialogAction
);

export const selectConfirmationDialogOpened = createSelector(
  uiSelector, (ui: UiState) => ui.confirmationDialogOpened
);

export const selectSidebarOpened = createSelector(
  uiSelector, (ui: UiState) => ui.sidebarOpened
);

export const selectSnackbarVisible = createSelector(
  uiSelector, (ui: UiState) => ui.snackbarVisible
);

export const selectSnackbarQueue = createSelector(
  uiSelector, (ui: UiState) => ui.snackbarQueue
);

export const selectContextMenuData = createSelector(
  uiSelector, (ui: UiState) => ui.contextMenuData
);
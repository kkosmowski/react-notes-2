import { createSelector } from 'reselect';
import { RootState } from '../interfaces/root-state.interface';
import { UiState } from '../interfaces/ui-state.interface';

const selector = (state: RootState) => state.ui;

export const selectNoteDialogOpened = createSelector(
  selector, (ui: UiState) => ui.noteDialogOpened
);

export const selectConfirmationResult = createSelector(
  selector, (ui: UiState) => ui.confirmationDialogResult
);

export const selectConfirmationData = createSelector(
  selector, (ui: UiState) => ui.confirmationDialogData
);

export const selectConfirmationDialogOpened = createSelector(
  selector, (ui: UiState) => ui.confirmationDialogOpened
);
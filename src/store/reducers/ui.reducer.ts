import { UiState } from '../interfaces/ui-state.interface';
import { UiActions } from '../actions/actions.enum';
import { Action } from '../../domain/interfaces/action.interface';

const initialState: UiState = {
  noteDialogOpened: false,
  confirmationDialogOpened: false,
  confirmationDialogData: null,
  confirmationDialogResult: null,
};

export default function ui(state = initialState, action: Action): UiState {
  switch (action.type) {
    case (UiActions.OPEN_NOTE_DIALOG): {
      return {
        ...state,
        noteDialogOpened: true,
      };
    }

    case (UiActions.CLOSE_NOTE_DIALOG): {
      return {
        ...state,
        noteDialogOpened: false,
      };
    }

    case (UiActions.OPEN_CONFIRMATION_DIALOG): {
      return {
        ...state,
        confirmationDialogOpened: true,
        confirmationDialogData: action.payload,
        confirmationDialogResult: null,
      };
    }

    case (UiActions.CLOSE_CONFIRMATION_DIALOG): {
      return {
        ...state,
        confirmationDialogOpened: false,
        confirmationDialogData: null,
        confirmationDialogResult: action.payload,
      };
    }
  }
  return state;
}
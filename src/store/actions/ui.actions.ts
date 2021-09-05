import { UiActions } from './actions.enum';
import { ActionFunction } from '../../domain/types/action-function.type';
import { Dispatch } from 'redux';
import { ConfirmationDialogData } from '../../domain/interfaces/confirmation-dialog-data.interface';

export function openNoteDialog(): ActionFunction<void> {
  return function (dispatch: Dispatch): void {
    dispatch({ type: UiActions.OPEN_NOTE_DIALOG });
  };
}

export function closeNoteDialog(): ActionFunction<void> {
  return function (dispatch: Dispatch): void {
    dispatch({ type: UiActions.CLOSE_NOTE_DIALOG });
  };
}

export function openConfirmationDialog(data: ConfirmationDialogData): ActionFunction<void> {
  return function (dispatch: Dispatch): void {
    dispatch({ type: UiActions.OPEN_CONFIRMATION_DIALOG, payload: data });
  };
}

export function closeConfirmationDialog(result: boolean): ActionFunction<void> {
  return function (dispatch: Dispatch): void {
    dispatch({ type: UiActions.CLOSE_CONFIRMATION_DIALOG, payload: result });
  };
}

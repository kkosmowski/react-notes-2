import { ConfirmationDialogData } from '../../domain/interfaces/confirmation-dialog-data.interface';
import uiActions from '../actions/ui.actions';
import { Action } from '../../domain/interfaces/action.interface';

export function openNoteDialog(): Action {
  return { type: uiActions.openNoteDialog };
}
export function closeNoteDialog(): Action {
  return { type: uiActions.closeNoteDialog };
}

export function openConfirmationDialog(data: ConfirmationDialogData): Action {
  return {
    type: uiActions.openConfirmationDialog,
    payload: data
  };
}
export function closeConfirmationDialog(result: boolean): Action {
  return {
    type: uiActions.closeConfirmationDialog,
    payload: result
  };
}

export function openSidebar(): Action {
  return { type: uiActions.openSidebar };
}
export function closeSidebar(): Action {
  return { type: uiActions.closeSidebar };
}

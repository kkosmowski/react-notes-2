import { ConfirmationDialogData } from '../../domain/interfaces/confirmation-dialog-data.interface';
import uiActions from '../actions/ui.actions';
import { Action } from '../../domain/interfaces/action.interface';

const UiActions = {
  openNoteDialog(): Action {
    return { type: uiActions.openNoteDialog };
  },
  closeNoteDialog(): Action {
    return { type: uiActions.closeNoteDialog };
  },

  openConfirmationDialog(data: ConfirmationDialogData): Action {
    return {
      type: uiActions.openConfirmationDialog,
      payload: data
    };
  },
  closeConfirmationDialog(result: boolean): Action {
    return {
      type: uiActions.closeConfirmationDialog,
      payload: result
    };
  },

  openSidebar(): Action {
    return { type: uiActions.openSidebar };
  },
  closeSidebar(): Action {
    return { type: uiActions.closeSidebar };
  },
};

export default UiActions;
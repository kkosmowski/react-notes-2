import { Action } from '../../domain/interfaces/action.interface';
import { ConfirmationDialogData } from '../../domain/interfaces/confirmation-dialog-data.interface';
import uiActions from '../actions/ui.actions';

const UiActions = {
  openNoteDialog(): Action {
    return uiActions.openNoteDialog();
  },
  closeNoteDialog(): Action {
    return uiActions.closeNoteDialog();
  },

  openConfirmationDialog(data: ConfirmationDialogData): Action {
    return uiActions.openConfirmationDialog(data);
  },
  closeConfirmationDialog(result: boolean): Action {
    return uiActions.closeConfirmationDialog(result);
  },

  openSidebar(): Action {
    return uiActions.openSidebar();
  },
  closeSidebar(): Action {
    return uiActions.closeSidebar();
  },
};

export default UiActions;
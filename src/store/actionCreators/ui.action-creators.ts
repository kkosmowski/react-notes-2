import { Action } from '../../domain/interfaces/action.interface';
import { ConfirmationDialogData } from '../../domain/interfaces/confirmation-dialog-data.interface';
import uiActions from '../actions/ui.actions';
import { ActionFunction } from '../../domain/types/action-function.type';
import { Dispatch } from 'redux';

const UiActions = {
  openNoteDialog(): ActionFunction<Promise<any>> {
    return async function (dispatch: Dispatch): Promise<any> {
      return dispatch(uiActions.openNoteDialog());
    };
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

  showSnackbar(action: Action): Action {
    return uiActions.showSnackbar(action);
  },
  hideSnackbar(): Action {
    return uiActions.hideSnackbar();
  },
};

export default UiActions;
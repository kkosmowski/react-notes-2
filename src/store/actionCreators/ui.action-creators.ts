import { Action } from '../../domain/interfaces/action.interface';
import uiActions from '../actions/ui.actions';
import { ActionFunction } from '../../domain/types/action-function.type';
import { Dispatch } from 'redux';
import { v4 } from 'uuid';
import { HistoryUtil } from '../../domain/utils/history.util';
import { ContextMenuData } from '../../domain/interfaces/context-menu-data.interface';
import { ConfirmationAction } from '../../domain/enums/confirmation-action.enum';
import { ConfirmationResult } from '../../domain/interfaces/confirmation-result.interface';

const UiActions = {
  openNoteDialog(): ActionFunction<Promise<Action>> {
    return async function (dispatch: Dispatch): Promise<Action> {
      return dispatch(uiActions.openNoteDialog());
    };
  },
  closeNoteDialog(): Action {
    return uiActions.closeNoteDialog();
  },

  openConfirmationDialog(confirmationAction: ConfirmationAction): Action {
    return uiActions.openConfirmationDialog(confirmationAction);
  },
  closeConfirmationDialog(result: ConfirmationResult): Action {
    return uiActions.closeConfirmationDialog(result);
  },
  clearConfirmationDialogData(): Action {
    return uiActions.clearConfirmationDialogData();
  },

  openSidebar(): Action {
    return uiActions.openSidebar();
  },
  closeSidebar(): Action {
    return uiActions.closeSidebar();
  },

  showSnackbar(action: Action): Action {
    return uiActions.showSnackbar({
      id: v4(),
      details: {
        action,
        reversible: HistoryUtil.isReversible(action.type),
      },
    });
  },
  hideSnackbar(): Action {
    return uiActions.hideSnackbar();
  },

  showContextMenu(data: ContextMenuData): Action {
    return uiActions.showContextMenu(data);
  },
  hideContextMenu(): Action {
    return uiActions.hideContextMenu();
  },
};

export default UiActions;
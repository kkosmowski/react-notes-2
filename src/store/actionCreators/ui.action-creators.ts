import { Action } from '../../domain/interfaces/action.interface';
import uiActions from '../actions/ui.actions';
import { ActionFunction } from '../../domain/types/action-function.type';
import { Dispatch } from 'redux';
import { v4 } from 'uuid';
import { HistoryUtil } from '../../domain/utils/history.util';
import { ContextMenuData } from '../../domain/interfaces/context-menu-data.interface';
import { ConfirmationAction } from '../../domain/enums/confirmation-action.enum';
import { ConfirmationResult } from '../../domain/interfaces/confirmation-result.interface';
import { EntityUid } from '../../domain/types/entity-uid.type';

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
  hideSnackbar(snackbarId?: EntityUid): Action {
    return uiActions.hideSnackbar(snackbarId);
  },

  showContextMenu(data: ContextMenuData): Action {
    return uiActions.showContextMenu(data);
  },
  hideContextMenu(): Action {
    return uiActions.hideContextMenu();
  },

  setIsMobile(isMobile: boolean): Action {
    return uiActions.setIsMobile(isMobile);
  },
};

export default UiActions;
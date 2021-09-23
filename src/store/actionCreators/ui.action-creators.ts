import { ConfirmationDialogData } from '../../domain/interfaces/confirmation-dialog-data.interface';
import uiActions from '../actions/ui.actions';

const UiActions = {
  openNoteDialog(): any {
    return uiActions.openNoteDialog();
  },
  closeNoteDialog(): any {
    return uiActions.closeNoteDialog();
  },

  openConfirmationDialog(data: ConfirmationDialogData): any {
    return uiActions.openConfirmationDialog(data);
  },
  closeConfirmationDialog(result: boolean): any {
    return uiActions.closeConfirmationDialog(result);
  },

  openSidebar(): any {
    return uiActions.openSidebar();
  },
  closeSidebar(): any {
    return uiActions.closeSidebar();
  },
};

export default UiActions;
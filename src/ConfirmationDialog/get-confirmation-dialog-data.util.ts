import { ConfirmationAction } from '../domain/enums/confirmation-action.enum';
import { ConfirmationDialogData } from '../domain/interfaces/confirmation-dialog-data.interface';

export const getConfirmationDialogData = (
  action: ConfirmationAction | null,
  selectedNotesCount: number,
): ConfirmationDialogData | null => {
  switch (action) {
    case (ConfirmationAction.LeaveNoteProgress):
      return {
        action,
        title: 'CONFIRMATION.TITLE.LEAVE_PROGRESS',
        message: 'CONFIRMATION.MESSAGE.LEAVE_PROGRESS',
        cancelButtonText: 'CONFIRMATION.CONTROLS.NO_CANCEL',
        confirmButtonText: 'CONFIRMATION.CONTROLS.YES_LEAVE',
      };

    case ConfirmationAction.DeleteNote:
      return {
        action,
        title: selectedNotesCount > 1 ? 'CONFIRMATION.TITLE.DELETE_NOTES' : 'CONFIRMATION.TITLE.DELETE_NOTE',
        message: selectedNotesCount > 1 ? 'CONFIRMATION.MESSAGE.DELETE_NOTES' : 'CONFIRMATION.MESSAGE.DELETE_NOTE',
        cancelButtonText: 'CONFIRMATION.CONTROLS.NO_CANCEL',
        confirmButtonText: 'CONFIRMATION.CONTROLS.YES_DELETE',
      };

    case ConfirmationAction.DeleteCategory:
      return {
        action,
        title: 'CONFIRMATION.TITLE.DELETE_CATEGORY',
        message: 'CONFIRMATION.MESSAGE.DELETE_CATEGORY',
        cancelButtonText: 'CONFIRMATION.CONTROLS.NO_CANCEL',
        confirmButtonText: 'CONFIRMATION.CONTROLS.YES_DELETE',
      };
  }

  return null;
};

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
        title: 'TITLE.LEAVE_PROGRESS',
        message: 'MESSAGE.LEAVE_PROGRESS',
        cancelButtonText: 'CONTROLS.NO_CANCEL',
        confirmButtonText: 'CONTROLS.YES_LEAVE',
      };

    case ConfirmationAction.DeleteNote:
      return {
        action,
        title: selectedNotesCount > 1 ? 'TITLE.DELETE_NOTES' : 'TITLE.DELETE_NOTE',
        message: selectedNotesCount > 1 ? 'MESSAGE.DELETE_NOTES' : 'MESSAGE.DELETE_NOTE',
        cancelButtonText: 'CONTROLS.NO_CANCEL',
        confirmButtonText: 'CONTROLS.YES_DELETE',
      };

    case ConfirmationAction.DeleteCategory:
      return {
        action,
        title: 'TITLE.DELETE_CATEGORY',
        message: 'MESSAGE.DELETE_CATEGORY',
        cancelButtonText: 'CONTROLS.NO_CANCEL',
        confirmButtonText: 'CONTROLS.YES_DELETE',
      };
  }

  return null;
};

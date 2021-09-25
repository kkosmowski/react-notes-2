import { Action } from '../domain/interfaces/action.interface';

export const getSnackbarMessageBasedOnAction = (action: Action): string => {
  let message = 'SNACKBAR:';

  switch (action.type) {
    case 'CREATE_CATEGORY_SUCCESS':
      message += 'CATEGORY_CREATED';
      break;

    case 'REMOVE_CATEGORY_SUCCESS':
      message += 'CATEGORY_REMOVED';
      break;

    case 'EDIT_CATEGORY_SUCCESS':
      message += 'CATEGORY_EDITED';
      break;

    case 'CREATE_NOTE_SUCCESS':
      message += 'NOTE_CREATED';
      break;

    case 'DELETE_NOTE_SUCCESS':
      message += 'NOTE_DELETED';
      break;

    case 'UPDATE_NOTE_SUCCESS':
      message += 'NOTE_UPDATED';
      break;

    default:
      message = '';
      throw new Error('Unknown action type.');
  }

  return message;
};
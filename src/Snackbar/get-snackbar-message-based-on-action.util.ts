import { Action } from '../domain/interfaces/action.interface';
import { Category } from '../domain/interfaces/category.interface';
import { NoteInterface } from '../domain/interfaces/note.interface';
import { RemoveFromCategorySuccessPayload } from '../domain/interfaces/remove-from-category-payload.interface';

export interface TranslationData {
  message: string;
  options?: Record<string, string>;
}

export const getSnackbarMessageBasedOnAction = (action: Action): TranslationData => {
  let message = 'SNACKBAR:';
  const options: Record<string, string> = {};

  switch (action.type) {
    case 'CREATE_CATEGORY_SUCCESS':
      message += 'CATEGORY_CREATED';
      options['name'] = (action.payload as Category).name;
      break;

    case 'DELETE_CATEGORY_SUCCESS':
      message += 'CATEGORY_DELETED';
      options['name'] = (action.payload as Category).name;
      break;

    case 'EDIT_CATEGORY_SUCCESS':
      message += 'CATEGORY_EDITED';
      options['name'] = (action.payload as Category).name;
      break;

    case 'RESTORE_CATEGORY_SUCCESS':
      message += 'CATEGORY_RESTORED';
      options['name'] = (action.payload as Category).name;
      break;

    case 'CREATE_NOTE_SUCCESS':
      message += 'NOTE_CREATED';
      options['name'] = (action.payload as NoteInterface).title;
      break;

    case 'DELETE_NOTE_SUCCESS':
      message += 'NOTE_DELETED';
      options['name'] = (action.payload as NoteInterface).title;
      break;

    case 'UPDATE_NOTE_SUCCESS':
      message += 'NOTE_UPDATED';
      options['name'] = (action.payload as NoteInterface).title;
      break;

    case 'RESTORE_NOTE_SUCCESS':
      message += 'NOTE_RESTORED';
      options['name'] = (action.payload as NoteInterface).title;
      break;

    case 'REMOVE_NOTE_FROM_CATEGORY_SUCCESS':
      message += 'NOTE_REMOVED_FROM_CATEGORY';
      options['name'] = (action.payload as RemoveFromCategorySuccessPayload).updatedNote.title;
      break;

    case 'RESTORE_NOTE_TO_CATEGORY_SUCCESS':
      message += 'NOTE_RESTORED_TO_CATEGORY';
      options['name'] = (action.payload as RemoveFromCategorySuccessPayload).updatedNote.title;
      break;

    case 'REMOVE_MULTIPLE_NOTES_FROM_CATEGORY_SUCCESS':
      message += 'NOTES_REMOVED_FROM_CATEGORY';
      break;

    case 'RESTORE_MULTIPLE_NOTES_TO_CATEGORY_SUCCESS':
      message += 'NOTES_RESTORED_TO_CATEGORY';
      break;

    default:
      message = '';
      throw new Error('Unknown action type.');
  }

  return {
    message,
    ...( Object.keys(options).length ? { options } : {})
  };
};
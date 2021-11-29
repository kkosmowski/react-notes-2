import { Category } from '../domain/interfaces/category.interface';
import { NoteInterface } from '../domain/interfaces/note.interface';
import { ActionDetails } from '../domain/interfaces/action-details.interface';

export interface TranslationData {
  message: string;
  options?: Record<string, string>;
}

export const getSnackbarMessageBasedOnAction = (details: ActionDetails): TranslationData => {
  let message: string;
  const options: Record<string, string> = {};
  const { type, payload } = details.action;

  switch (type) {
    case 'CREATE_CATEGORY_SUCCESS':
      message = 'CATEGORY_CREATED';
      options.name = (payload as Category).name;
      break;

    case 'DELETE_CATEGORY_SUCCESS':
      message = 'CATEGORY_DELETED';
      options.name = (payload as Category).name;
      break;

    case 'UPDATE_CATEGORY_SUCCESS':
      message = 'CATEGORY_UPDATED';
      options.name = (payload as Category).name;
      break;

    case 'REVERT_CATEGORY_UPDATE_SUCCESS':
      message = 'CATEGORY_UPDATE_REVERTED';
      options.name = (payload as Category).name;
      break;

    case 'RESTORE_CATEGORY_SUCCESS':
      message = 'CATEGORY_RESTORED';
      options.name = (payload as Category).name;
      break;

    case 'CREATE_NOTE_SUCCESS':
      message = 'NOTE_CREATED';
      options.name = (payload as NoteInterface).title;
      break;

    case 'ARCHIVE_NOTE_SUCCESS':
      message = 'NOTE_ARCHIVED';
      options.name = (payload as NoteInterface).title;
      break;

    case 'DELETE_NOTE_SUCCESS':
      message = 'NOTE_DELETED';
      options.name = (payload as NoteInterface).title;
      break;

    case 'UPDATE_NOTE_SUCCESS':
      message = 'NOTE_UPDATED';
      options.name = (payload as NoteInterface).title;
      break;

    case 'REVERT_NOTE_UPDATE_SUCCESS':
      message = 'NOTE_UPDATE_REVERTED';
      options.name = (payload as NoteInterface).title;
      break;

    case 'RESTORE_NOTE_SUCCESS':
      message = 'NOTE_RESTORED';
      options.name = (payload as NoteInterface).title;
      break;

    case 'DELETE_MULTIPLE_NOTES_SUCCESS':
      message = 'MULTIPLE_NOTES_DELETED';
      break;

    case 'ARCHIVE_MULTIPLE_NOTES_SUCCESS':
      message = 'MULTIPLE_NOTES_ARCHIVED';
      break;

    case 'RESTORE_MULTIPLE_NOTES_SUCCESS':
      message = 'MULTIPLE_NOTES_RESTORED';
      break;

    case 'REMOVE_NOTE_FROM_CATEGORY_SUCCESS':
      message = 'NOTE_REMOVED_FROM_CATEGORY';
      options.name = (payload as NoteInterface).title;
      break;

    case 'RESTORE_NOTE_TO_CATEGORY_SUCCESS':
      message = 'NOTE_RESTORED_TO_CATEGORY';
      options.name = (payload as NoteInterface).title;
      break;

    case 'REMOVE_MULTIPLE_NOTES_FROM_CATEGORY_SUCCESS':
      message = 'NOTES_REMOVED_FROM_CATEGORY';
      break;

    case 'RESTORE_MULTIPLE_NOTES_TO_CATEGORY_SUCCESS':
      message = 'NOTES_RESTORED_TO_CATEGORY';
      break;

    case 'UPDATE_MULTIPLE_NOTES_SUCCESS':
      message = 'MULTIPLE_NOTES_UPDATED';
      break;

    default:
      throw new Error('Unknown action type.');
  }

  return {
    message,
    ...(Object.keys(options).length ? { options } : {})
  };
};
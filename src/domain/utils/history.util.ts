import CategoryActions from '../../store/actionCreators/category.action-creators';
import NoteActions from '../../store/actionCreators/note.action-creators';
import { ActionFunction } from '../types/action-function.type';
import { RemoveFromCategoryPayload } from '../interfaces/remove-from-category-payload.interface';
import { RemoveMultipleNotesFromCategoryPayload } from '../interfaces/remove-multiple-notes-from-category-payload.interface';
import { NoteInterface } from '../interfaces/note.interface';
import { ActionDetails } from '../interfaces/action-details.interface';

export class HistoryUtil {
  static getRevertedAction(details: ActionDetails): ActionFunction<Promise<void> | void> {
    const type = details.action.type;
    const payload = details.action.payload;

    switch (type) {
      case 'CREATE_CATEGORY_SUCCESS':
        return CategoryActions.deleteCategory(payload);

      case 'DELETE_CATEGORY_SUCCESS':
        return CategoryActions.restoreCategory(payload);

      case 'UPDATE_CATEGORY_SUCCESS':
        return CategoryActions.revertCategoryUpdate(payload);

      case 'CREATE_NOTE_SUCCESS':
        return NoteActions.deleteNote((payload as NoteInterface).id);

      case 'ARCHIVE_NOTE_SUCCESS':
        return NoteActions.restoreNote((payload as NoteInterface).id);

      case 'ARCHIVE_MULTIPLE_NOTES_SUCCESS':
        return NoteActions.restoreMultipleNotes(payload);

      case 'UPDATE_NOTE_SUCCESS':
        return NoteActions.revertNoteUpdate(payload);

      case 'REMOVE_NOTE_FROM_CATEGORY_SUCCESS':
        return NoteActions.restoreToCategory({
          noteId: payload.updatedNote.id,
          categoryId: payload.categoryId,
        } as RemoveFromCategoryPayload);

      case 'REMOVE_MULTIPLE_NOTES_FROM_CATEGORY_SUCCESS':
        return NoteActions.restoreMultipleNotesToCategory({
          noteIds: payload.updatedNotes.map((note: NoteInterface) => note.id),
          categoryId: payload.categoryId,
        } as RemoveMultipleNotesFromCategoryPayload);

      default:
        throw new Error('Unknown action type.');
    }
  }

  static isReversible(type: string): boolean {
    const irreversibleActionTypes: string[] = [
      'RESTORE_CATEGORY_SUCCESS',
      'RESTORE_NOTE_SUCCESS',
      'RESTORE_MULTIPLE_NOTES_SUCCESS',
      'RESTORE_NOTE_TO_CATEGORY_SUCCESS',
      'RESTORE_MULTIPLE_NOTES_TO_CATEGORY_SUCCESS',
      'REVERT_NOTE_UPDATE_SUCCESS',
      'REVERT_CATEGORY_UPDATE_SUCCESS',
      'DELETE_NOTE_SUCCESS',
      'DELETE_MULTIPLE_NOTES_SUCCESS',
      'UPDATE_MULTIPLE_NOTES_SUCCESS',
    ];
    return !irreversibleActionTypes.includes(type);
  }
}
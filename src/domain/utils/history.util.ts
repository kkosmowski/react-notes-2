import { Action } from '../interfaces/action.interface';
import CategoryActions from '../../store/actionCreators/category.action-creators';
import NoteActions from '../../store/actionCreators/note.action-creators';
import { ActionFunction } from '../types/action-function.type';
import { RemoveFromCategoryPayload } from '../interfaces/remove-from-category-payload.interface';
import { RemoveMultipleNotesFromCategoryPayload } from '../interfaces/remove-multiple-notes-from-category-payload.interface';
import { NoteInterface } from '../interfaces/note.interface';
import { ActionDetails } from '../interfaces/action-details.interface';

export class HistoryUtil {
  static getRevertedAction(details: ActionDetails): Action | ActionFunction<any> {
    const type = details.action.type;
    let payload = details.action.payload;
    let revertedAction: (payload: any) => Action | ActionFunction<any>;
    switch (type) {
      case 'CREATE_CATEGORY_SUCCESS':
        revertedAction = CategoryActions.deleteCategory;
        break;

      case 'DELETE_CATEGORY_SUCCESS':
        revertedAction = CategoryActions.restoreCategory;
        break;

      case 'EDIT_CATEGORY_SUCCESS':
        revertedAction = CategoryActions.editCategory;
        break;

      case 'CREATE_NOTE_SUCCESS':
        revertedAction = NoteActions.deleteNote;
        break;

      case 'DELETE_NOTE_SUCCESS':
        revertedAction = NoteActions.restoreNote;
        break;

      case 'UPDATE_NOTE_SUCCESS':
        revertedAction = NoteActions.updateNote;
        break;

      case 'REMOVE_NOTE_FROM_CATEGORY_SUCCESS':
        revertedAction = NoteActions.restoreToCategory;
        payload = ({
          noteId: payload.updatedNote.id,
          categoryId: payload.categoryId,
        } as RemoveFromCategoryPayload);
        break;

      case 'REMOVE_MULTIPLE_NOTES_FROM_CATEGORY_SUCCESS':
        revertedAction = NoteActions.restoreMultipleNotesToCategory;
        payload = ({
          noteIds: payload.updatedNotes.map((note: NoteInterface) => note.id),
          categoryId: payload.categoryId,
        } as RemoveMultipleNotesFromCategoryPayload);
        break;

      default:
        throw new Error('Unknown action type.');
    }

    return revertedAction(payload);
  }

  static isReversible(type: string): boolean {
    const irreversibleActionTypes: string[] = [
      'RESTORE_CATEGORY_SUCCESS',
      'RESTORE_NOTE_SUCCESS',
      'RESTORE_NOTE_TO_CATEGORY_SUCCESS',
      'RESTORE_MULTIPLE_NOTES_TO_CATEGORY_SUCCESS'
    ];
    return !irreversibleActionTypes.includes(type);
  }
}
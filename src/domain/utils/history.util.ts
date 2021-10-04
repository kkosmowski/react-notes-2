import { Action } from '../interfaces/action.interface';
import CategoryActions from '../../store/actionCreators/category.action-creators';
import NoteActions from '../../store/actionCreators/note.action-creators';
import { ActionFunction } from '../types/action-function.type';
import { RemoveFromCategoryPayload } from '../interfaces/remove-from-category-payload.interface';

export class HistoryUtil {
  static getRevertedAction(action: Action): Action | ActionFunction<any> {
    const type = action.type;
    let payload = action.payload;
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

      default:
        throw new Error('Unknown action type.');
    }

    return revertedAction(payload);
  }
}
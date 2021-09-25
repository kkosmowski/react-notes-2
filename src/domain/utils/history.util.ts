import { Action } from '../interfaces/action.interface';
import CategoryActions from '../../store/actionCreators/category.action-creators';
import NoteActions from '../../store/actionCreators/note.action-creators';
import { ActionFunction } from '../types/action-function.type';

export class HistoryUtil {
  static getRevertedAction(action: Action): Action | ActionFunction<any> {
    const { type, payload } = action;
    let revertedAction: (payload: any) => Action | ActionFunction<any>;
    switch (type) {
      case 'CREATE_CATEGORY_SUCCESS':
        revertedAction = CategoryActions.removeCategory;
        break;

      case 'REMOVE_CATEGORY_SUCCESS':
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

      default:
        throw new Error('Unknown action type.');
    }

    return revertedAction(payload);
  }
}
import { NoteActions } from './actions.enum';
import { ActionFunction } from '../../domain/types/action-function.type';
import { Dispatch } from 'redux';
import { HttpService } from '../../services/http.service';
import { NoteInterface } from '../../domain/interfaces/note.interface';
import { EntityUid } from '../../domain/types/entity-uid.type';
import { addNoteToCategories } from './category.actions';

export function get(): ActionFunction<Promise<void>> {
  return function (dispatch: Dispatch): Promise<void> {
    dispatch({ type: NoteActions.GET_NOTES });
    return HttpService
      .get('/notes')
      .then((notes: NoteInterface[]) => {
        dispatch({ type: NoteActions.GET_NOTES_SUCCESS, payload: notes });
      })
      .catch(error => {
        console.error(error);
        dispatch({ type: NoteActions.GET_NOTES_FAIL });
      });
  };
}

export function create(note: NoteInterface): ActionFunction<Promise<void>> {
  return function (dispatch: Dispatch): Promise<void> {
    dispatch({ type: NoteActions.CREATE_NOTE });
    return HttpService
      .post<NoteInterface>('/notes', note)
      .then(() => {
        dispatch({ type: NoteActions.CREATE_NOTE_SUCCESS, payload: note });
      })
      .catch(error => {
        console.error(error);
        dispatch({ type: NoteActions.CREATE_NOTE_FAIL });
      });
  };
}

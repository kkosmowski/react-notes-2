import { NoteActions } from './actions.enum';
import { ActionFunction } from '../../domain/types/action-function.type';
import { Dispatch } from 'redux';
import { HttpService } from '../../services/http.service';
import { Note } from '../../domain/interfaces/note.interface';

export function create(note: Note): ActionFunction<Promise<void>> {
  return function (dispatch: Dispatch): Promise<void> {
    dispatch({ type: NoteActions.CREATE_NOTE });
    return HttpService
      .post<Note>('/notes', note)
      .then(() => {
        dispatch({ type: NoteActions.CREATE_NOTE_SUCCESS, payload: note });
      })
      .catch(() => {
        dispatch({ type: NoteActions.CREATE_NOTE_FAIL });
      });
  };
}

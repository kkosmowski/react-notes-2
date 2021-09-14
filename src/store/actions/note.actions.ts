import { NoteActions } from './actions.enum';
import { ActionFunction } from '../../domain/types/action-function.type';
import { Dispatch } from 'redux';
import { HttpService } from '../../services/http.service';
import { NoteInterface } from '../../domain/interfaces/note.interface';
import { NoteSelectionMode } from '../../domain/enums/note-selection-mode.enum';
import { EntityUid } from '../../domain/types/entity-uid.type';

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

export function changeSelectionMode(mode: NoteSelectionMode): ActionFunction<void> {
  return function (dispatch: Dispatch): void {
    dispatch({ type: NoteActions.CREATE_NOTE, payload: mode });
  };
}

export function setOpenedNote(note: NoteInterface | null): ActionFunction<void> {
  return function (dispatch: Dispatch): void {
    dispatch({ type: NoteActions.SET_OPENED_NOTE, payload: note });
  };
}

export function deleteNote(noteId: EntityUid): ActionFunction<void> {
  return function (dispatch: Dispatch): void {
    // @todo
    console.log('delete note');
    // dispatch({ type: NoteActions.DELETE_NOTE, payload: noteId });
  };
}

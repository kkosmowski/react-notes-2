import { ActionFunction } from '../../domain/types/action-function.type';
import { Dispatch } from 'redux';
import { HttpService } from '../../services/http.service';
import { NoteInterface } from '../../domain/interfaces/note.interface';
import { NoteSelectionMode } from '../../domain/enums/note-selection-mode.enum';
import { EntityUid } from '../../domain/types/entity-uid.type';
import noteActions from '../actions/note.actions';
import { Action } from '../../domain/interfaces/action.interface';

const NoteActions = {
  get(): ActionFunction<Promise<void>> {
    return function (dispatch: Dispatch): Promise<void> {
      dispatch({ type: noteActions.getNotes });
      return HttpService
        .get('/notes')
        .then((notes: NoteInterface[]) => {
          dispatch({ type: noteActions.getNotesSuccess, payload: notes });
        })
        .catch(error => {
          console.error(error);
          dispatch({ type: noteActions.getNotesFail });
        });
    };
  },

  create(note: NoteInterface): ActionFunction<Promise<void>> {
    return function (dispatch: Dispatch): Promise<void> {
      dispatch({ type: noteActions.createNote });
      return HttpService
        .post<NoteInterface>('/notes', note)
        .then(() => {
          dispatch({ type: noteActions.createNoteSuccess, payload: note });
        })
        .catch(error => {
          console.error(error);
          dispatch({ type: noteActions.createNoteFail });
        });
    };
  },

  changeSelectionMode(mode: NoteSelectionMode): Action {
    return ({ type: noteActions.changeSelectionMode, payload: mode });
  },

  setOpenedNote(note: NoteInterface | null): Action {
    return ({ type: noteActions.setOpenedNote, payload: note });
  },

  deleteNote(noteId: EntityUid): ActionFunction<Promise<void>> {
    return function (dispatch: Dispatch): Promise<void> {
      dispatch({ type: noteActions.deleteNote });
      //@todo implement soft delete (as a separate "Archive" feature)
      return HttpService
        .delete(`/notes/${ noteId }`)
        .then(() => {
          dispatch({ type: noteActions.deleteNoteSuccess, payload: noteId });
        })
        .catch(error => {
          console.error(error);
          dispatch({ type: noteActions.deleteNoteFail });
        });
    }
  },

  updateNote(note: NoteInterface): ActionFunction<Promise<void>> {
    return function (dispatch: Dispatch): Promise<void> {
      dispatch({ type: noteActions.updateNote });
      return HttpService
        .put(`/notes/${ note.id }`, note)
        .then(() => {
          dispatch({ type: noteActions.updateNoteSuccess, payload: note });
        })
        .catch(error => {
          console.error(error);
          dispatch({ type: noteActions.updateNoteFail });
        });
    }
  }
};

export default NoteActions;
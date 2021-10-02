import { ActionFunction } from '../../domain/types/action-function.type';
import { Dispatch } from 'redux';
import { HttpService } from '../../services/http.service';
import { NoteInterface } from '../../domain/interfaces/note.interface';
import { EntityUid } from '../../domain/types/entity-uid.type';
import noteActions from '../actions/note.actions';
import { Action } from '../../domain/interfaces/action.interface';
import HistoryActions from './history.action-creators';

const NoteActions = {
  get(): ActionFunction<Promise<void>> {
    return function (dispatch: Dispatch): Promise<void> {
      dispatch(noteActions.getNotes());
      return HttpService
        .get('/notes')
        .then((notes: NoteInterface[]) => {
          dispatch(noteActions.getNotesSuccess(notes));
        })
        .catch(error => {
          console.error(error);
          dispatch(noteActions.getNotesFail());
        });
    };
  },

  // for testing purpose only
  _getSuccess(payload: NoteInterface[]): ActionFunction<Promise<void>> {
    return async function (dispatch: Dispatch): Promise<void> {
      dispatch(noteActions.getNotesSuccess(payload));
    };
  },

  create(note: NoteInterface): ActionFunction<Promise<void>> {
    return function (dispatch: Dispatch): Promise<void> {
      dispatch(noteActions.createNote());
      return HttpService
        .post<NoteInterface>('/notes', note)
        .then(() => {
          dispatch(noteActions.createNoteSuccess(note));
          // @todo implement
          // HistoryActions.push(noteActions.createNoteSuccess(note))(dispatch);
        })
        .catch(error => {
          console.error(error);
          dispatch(noteActions.createNoteFail());
        });
    };
  },

  toggleSelectionMode(): ActionFunction<Promise<void>> {
    return async function (dispatch: Dispatch): Promise<void> {
      dispatch(noteActions.toggleSelectionMode());
    };
  },
  selectNote(noteId: EntityUid): ActionFunction<Promise<void>> {
    return async function (dispatch: Dispatch): Promise<void> {
      dispatch(noteActions.selectNote(noteId));
    };
  },
  deselectNote(noteId: EntityUid): Action {
    return noteActions.deselectNote(noteId);
  },
  clearSelection(): Action {
    return noteActions.clearSelection();
  },

  setOpenedNote(note: NoteInterface | null): Action {
    return noteActions.setOpenedNote(note);
  },

  deleteNote(noteId: EntityUid): ActionFunction<Promise<void>> {
    return function (dispatch: Dispatch): Promise<void> {
      dispatch(noteActions.deleteNote());
      return HttpService
        .patch(`/notes/${ noteId }`, {
          deleted: true
        })
        .then((note: NoteInterface) => {
          dispatch(noteActions.deleteNoteSuccess(note));
          HistoryActions.push(noteActions.deleteNoteSuccess(note))(dispatch);
        })
        .catch(error => {
          console.error(error);
          dispatch(noteActions.deleteNoteFail());
        });
    };
  },

  updateNote(note: NoteInterface): ActionFunction<Promise<void>> {
    return function (dispatch: Dispatch): Promise<void> {
      dispatch(noteActions.updateNote());
      return HttpService
        .put(`/notes/${ note.id }`, note)
        .then(() => {
          dispatch(noteActions.updateNoteSuccess(note));
          // @todo implement
          // HistoryActions.push(noteActions.updateNoteSuccess(note))(dispatch);
        })
        .catch(error => {
          console.error(error);
          dispatch(noteActions.updateNoteFail());
        });
    };
  },

  restoreNote(note: NoteInterface): ActionFunction<Promise<void>> {
    return function (dispatch: Dispatch): Promise<void> {
      dispatch(noteActions.restoreNote());
      return HttpService
        .patch(`/notes/${ note.id }`, {
          deleted: false,
        })
        .then(() => {
          dispatch(noteActions.restoreNoteSuccess(note));
        })
        .catch(error => {
          console.error(error);
          dispatch(noteActions.restoreNoteFail());
        });
    };
  },
};

export default NoteActions;
import { ActionFunction } from '../../domain/types/action-function.type';
import { Dispatch } from 'redux';
import { HttpService } from '../../services/http.service';
import { NoteInterface } from '../../domain/interfaces/note.interface';
import { NoteSelectionMode } from '../../domain/enums/note-selection-mode.enum';
import { EntityUid } from '../../domain/types/entity-uid.type';
import noteActions from '../actions/note.actions';

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

  create(note: NoteInterface): ActionFunction<Promise<void>> {
    return function (dispatch: Dispatch): Promise<void> {
      dispatch(noteActions.createNote());
      return HttpService
        .post<NoteInterface>('/notes', note)
        .then(() => {
          dispatch(noteActions.createNoteSuccess(note));
        })
        .catch(error => {
          console.error(error);
          dispatch(noteActions.createNoteFail());
        });
    };
  },

  changeSelectionMode(mode: NoteSelectionMode): any {
    return noteActions.changeSelectionMode(mode);
  },

  setOpenedNote(note: NoteInterface | null): any {
    return noteActions.setOpenedNote(note);
  },

  deleteNote(noteId: EntityUid): ActionFunction<Promise<void>> {
    return function (dispatch: Dispatch): Promise<void> {
      dispatch(noteActions.deleteNote());
      //@todo implement soft delete (as a separate "Archive" feature)
      return HttpService
        .delete(`/notes/${ noteId }`)
        .then(() => {
          dispatch(noteActions.deleteNoteSuccess(noteId));
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
        })
        .catch(error => {
          console.error(error);
          dispatch(noteActions.updateNoteFail());
        });
    };
  }
};

export default NoteActions;
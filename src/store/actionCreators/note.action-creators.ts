import { ActionFunction } from '../../domain/types/action-function.type';
import { Dispatch } from 'redux';
import { HttpService } from '../../services/http.service';
import { NoteInterface } from '../../domain/interfaces/note.interface';
import { EntityUid } from '../../domain/types/entity-uid.type';
import noteActions from '../actions/note.actions';
import { Action } from '../../domain/interfaces/action.interface';
import HistoryActions from './history.action-creators';
import store from '../store';
import { RootState } from '../interfaces/root-state.interface';
import { RemoveFromCategoryPayload } from '../../domain/interfaces/remove-from-category-payload.interface';

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

  removeFromCategory({ noteId, categoryId }: RemoveFromCategoryPayload): ActionFunction<Promise<void>> {
    return function (dispatch: Dispatch): Promise<void> {
      dispatch(noteActions.removeNoteFromCategory());
      const note: NoteInterface = (store.getState() as RootState).note.notes.find((note) => note.id === noteId)!;
      const noteCategories: EntityUid[] = note.categories.filter((catId) => catId !== categoryId);

      return HttpService
        .patch(`/notes/${ noteId }`, { categories: noteCategories })
        .then((updatedNote: NoteInterface) => {
          dispatch(noteActions.removeNoteFromCategorySuccess({ updatedNote, categoryId }));
          HistoryActions.push(noteActions.removeNoteFromCategorySuccess({ updatedNote, categoryId }))(dispatch);
        })
        .catch((error) => {
          console.error(error);
          dispatch(noteActions.removeNoteFromCategoryFail());
        });
    };
  },
  restoreToCategory({ noteId , categoryId }: RemoveFromCategoryPayload): ActionFunction<Promise<void>> {
    return function (dispatch: Dispatch): Promise<void> {
      dispatch(noteActions.restoreNoteToCategory());
      const note: NoteInterface = (store.getState() as RootState).note.notes.find((note) => note.id === noteId)!;
      const noteCategories: EntityUid[] = [...note.categories, categoryId];

      return HttpService
        .patch(`/notes/${ noteId }`, { categories: noteCategories })
        .then((updatedNote: NoteInterface) => {
          dispatch(noteActions.restoreNoteToCategorySuccess({ updatedNote, categoryId }));
          HistoryActions.push(noteActions.restoreNoteToCategorySuccess({ updatedNote, categoryId }))(dispatch);
        })
        .catch((error) => {
          console.error(error);
          dispatch(noteActions.restoreNoteToCategoryFail());
        });
    };
  },

  // removeMultipleNotesFromCategory(categoryId: EntityUid): ActionFunction<Promise<void>> {
  //   return function (dispatch: Dispatch): Promise<void> {
  //     dispatch(noteActions.removeMultipleNotesFromCategory());
  //
  //     const updatedNotes: NoteInterface[] = (store.getState() as RootState).note.notes
  //       .map((note) => ({
  //         ...note,
  //         categories: note.categories.filter((catId) => catId !== categoryId),
  //       }));
  //
  //     return HttpService
  //       .patch('/notes', updatedNotes)
  //       .then(() => {
  //         dispatch(noteActions.removeMultipleNotesFromCategorySuccess(updatedNotes));
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //         dispatch(noteActions.removeMultipleNotesFromCategoryFail());
  //       });
  //   };
  // }
};

export default NoteActions;
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
import { RemoveMultipleNotesFromCategoryPayload } from '../../domain/interfaces/remove-multiple-notes-from-category-payload.interface';

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
          HistoryActions.push(noteActions.createNoteSuccess(note))(dispatch);
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

  setOpenedNote(note: NoteInterface): Action {
    return noteActions.setOpenedNote(note);
  },
  clearOpenedNote(): Action {
    return noteActions.clearOpenedNote();
  },
  findOpenedNote(noteId: EntityUid): Action {
    return noteActions.findOpenedNote(noteId);
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
          dispatch(NoteActions.clearSelection());
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
          HistoryActions.push(noteActions.restoreNoteSuccess(note))(dispatch);
        })
        .catch(error => {
          console.error(error);
          dispatch(noteActions.restoreNoteFail());
        });
    };
  },

  removeFromCategory({ noteId, categoryId }: RemoveFromCategoryPayload): ActionFunction<Promise<void>> {
    return removeOrRestore('removeNoteFromCategory', { noteId, categoryId }, true);
  },
  restoreToCategory({ noteId, categoryId }: RemoveFromCategoryPayload): ActionFunction<Promise<void>> {
    return removeOrRestore('restoreNoteToCategory', { noteId, categoryId }, false);
  },

  removeMultipleNotesFromCategory({
    noteIds,
    categoryId
  }: RemoveMultipleNotesFromCategoryPayload): ActionFunction<void> {
    return removeOrRestoreMultiple('removeMultipleNotesFromCategory', { noteIds, categoryId }, true);
  },
  restoreMultipleNotesToCategory({
    noteIds,
    categoryId
  }: RemoveMultipleNotesFromCategoryPayload): ActionFunction<void> {
    return removeOrRestoreMultiple('restoreMultipleNotesToCategory', { noteIds, categoryId }, false);
  },
};
const removeOrRestore = (
  actionName: 'removeNoteFromCategory' | 'restoreNoteToCategory',
  payload: RemoveFromCategoryPayload,
  clearSelection: boolean,
): ActionFunction<Promise<void>> => {
  const success = actionName + 'Success' as 'removeNoteFromCategorySuccess' | 'restoreNoteToCategorySuccess';
  const fail = actionName + 'Fail' as 'removeNoteFromCategoryFail' | 'restoreNoteToCategoryFail';
  return function (dispatch: Dispatch): Promise<void> {
    dispatch(noteActions[actionName]());
    const note: NoteInterface = (store.getState() as RootState).note.notes.find((note) => note.id === payload.noteId)!;
    const noteCategories: EntityUid[] = actionName === 'removeNoteFromCategory'
      ? note.categories.filter((catId) => catId !== payload.categoryId)
      : [...note.categories, payload.categoryId];

    return HttpService
      .patch(`/notes/${ payload.noteId }`, { categories: noteCategories })
      .then((updatedNote: NoteInterface) => {
        dispatch(noteActions[success]({ updatedNote, categoryId: payload.categoryId }));
        HistoryActions.push(noteActions[success]({ updatedNote, categoryId: payload.categoryId }))(dispatch);
        clearSelection && dispatch(NoteActions.clearSelection());
      })
      .catch((error) => {
        console.error(error);
        dispatch(noteActions[fail]());
      });
  };
};

const removeOrRestoreMultiple = (
  actionName: 'removeMultipleNotesFromCategory' | 'restoreMultipleNotesToCategory',
  payload: RemoveMultipleNotesFromCategoryPayload,
  clearSelection: boolean,
): ActionFunction<void> => {
  const success = actionName + 'Success' as 'removeMultipleNotesFromCategorySuccess' | 'restoreMultipleNotesToCategorySuccess';
  const fail = actionName + 'Fail' as 'removeMultipleNotesFromCategoryFail' | 'restoreMultipleNotesToCategoryFail';
  return function (dispatch: Dispatch): void {
    dispatch(noteActions[actionName]());

    const notes: NoteInterface[] = (store.getState() as RootState).note.notes;
    const updatedNotes = notes
      .filter((note) => payload.noteIds.includes(note.id))
      .map((note) => ({
        ...note,
        categories: actionName === 'removeMultipleNotesFromCategory'
          ? note.categories.filter((catId) => catId !== payload.categoryId)
          : [...note.categories, payload.categoryId],
      }));

    new Promise((resolve) => {
      updatedNotes.forEach((note: NoteInterface) => {
        HttpService
          .put(`/notes/${ note.id }`, note)
          .catch((error) => {
            console.error(error);
            dispatch(noteActions[fail]());
          });
      });
      resolve(true);
    })
      .then(() => {
        dispatch(noteActions[success]({ updatedNotes, categoryId: payload.categoryId }));
        HistoryActions.push(noteActions[success]({ updatedNotes, categoryId: payload.categoryId }))(dispatch);
        clearSelection && dispatch(NoteActions.clearSelection());
      })
      .catch((error) => {
        console.error(error);
        dispatch(noteActions[fail]());
      });
  };
};

export default NoteActions;
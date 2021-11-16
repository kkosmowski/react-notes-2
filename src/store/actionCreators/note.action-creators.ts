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
import { ArchiveOrDeleteOrRestoreMultipleNotesPayload } from '../../domain/interfaces/archive-or-delete-or-restore-multiple-notes-payload.interface';
import UiActions from './ui.action-creators';

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
  selectMultipleNotes(noteIds: EntityUid[]): ActionFunction<Promise<void>> {
    return async function (dispatch: Dispatch): Promise<void> {
      dispatch(noteActions.selectMultipleNotes(noteIds));
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

  archiveNote(noteId: EntityUid): ActionFunction<Promise<void>> {
    return function (dispatch: Dispatch): Promise<void> {
      dispatch(noteActions.archiveNote());
      return HttpService
        .patch(`/notes/${ noteId }`, {
          archived: true,
          archivedAt: new Date().toISOString(),
        })
        .then((note: NoteInterface) => {
          dispatch(noteActions.archiveNoteSuccess(note));
          HistoryActions.push(noteActions.archiveNoteSuccess(note))(dispatch);
          dispatch(NoteActions.clearSelection());
        })
        .catch(error => {
          console.error(error);
          dispatch(noteActions.archiveNoteFail());
        });
    };
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
          dispatch(UiActions.checkIfSnackbarInformsAboutThis(note.id));
        })
        .catch(error => {
          console.error(error);
          dispatch(noteActions.deleteNoteFail());
        });
    };
  },

  deleteMultipleNotes(noteIds: EntityUid[]): ActionFunction<Promise<void>> {
    return archiveOrDeleteOrRestoreMultiple(noteIds, 'deleteMultipleNotes');
  },

  archiveMultipleNotes(noteIds: EntityUid[]): ActionFunction<Promise<void>> {
    return archiveOrDeleteOrRestoreMultiple(noteIds, 'archiveMultipleNotes');
  },
  restoreMultipleNotes(noteIds: EntityUid[]): ActionFunction<Promise<void>> {
    return archiveOrDeleteOrRestoreMultiple(noteIds, 'restoreMultipleNotes');
  },

  updateNote(note: NoteInterface): ActionFunction<Promise<void>> {
    return updateOrRevert(note, 'updateNote');
  },

  revertNoteUpdate(note: NoteInterface): ActionFunction<Promise<void>> {
    return updateOrRevert(note, 'revertNoteUpdate');
  },

  restoreNote(note: NoteInterface): ActionFunction<Promise<void>> {
    return function (dispatch: Dispatch): Promise<void> {
      dispatch(noteActions.restoreNote());
      return HttpService
        .patch(`/notes/${ note.id }`, {
          archived: false,
          archivedAt: null,
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

  setShowArchived(showArchived: boolean): Action {
    return noteActions.setShowArchived(showArchived);
  },
};

const archiveOrDeleteOrRestoreMultiple = (
  noteIds: EntityUid[],
  actionName: 'archiveMultipleNotes' | 'deleteMultipleNotes' | 'restoreMultipleNotes'
): ActionFunction<Promise<void>> => {
  const successAction = actionName + 'Success' as 'archiveMultipleNotesSuccess' | 'deleteMultipleNotesSuccess' | 'restoreMultipleNotesSuccess';
  const failAction = actionName + 'Fail' as 'archiveMultipleNotesFail' | 'deleteMultipleNotesFail' | 'restoreMultipleNotesFail';

  return function (dispatch: Dispatch): Promise<void> {
    dispatch(noteActions[actionName]());

    const date = new Date().toISOString();
    return new Promise((resolve) => {
      noteIds.forEach((noteId: EntityUid) => {
        HttpService
          .patch(`/notes/${ noteId }`, {
            ...(actionName === 'deleteMultipleNotes'
              ? { deleted: true }
              : {
                archived: actionName === 'archiveMultipleNotes',
                archivedAt: actionName === 'archiveMultipleNotes'
                  ? date
                  : null
              }
            )
          })
          .catch((error) => {
            console.error(error);
            dispatch(noteActions[failAction]());
          });
      });
      resolve(true);
    })
      .then(() => {
        const payload: ArchiveOrDeleteOrRestoreMultipleNotesPayload = {
          noteIds,
          ...(actionName === 'archiveMultipleNotes' && { date })
        };
        dispatch(noteActions[successAction](payload));
        HistoryActions.push(noteActions[successAction](noteIds))(dispatch);
        dispatch(NoteActions.clearSelection());
      })
      .catch((error) => {
        console.error(error);
        dispatch(noteActions[failAction]());
      });
  };
};

const removeOrRestore = (
  actionName: 'removeNoteFromCategory' | 'restoreNoteToCategory',
  payload: RemoveFromCategoryPayload,
  clearSelection: boolean,
): ActionFunction<Promise<void>> => {
  const successAction = actionName + 'Success' as 'removeNoteFromCategorySuccess' | 'restoreNoteToCategorySuccess';
  const failAction = actionName + 'Fail' as 'removeNoteFromCategoryFail' | 'restoreNoteToCategoryFail';

  return function (dispatch: Dispatch): Promise<void> {
    dispatch(noteActions[actionName]());
    const note: NoteInterface = (store.getState() as RootState).note.notes.find((note) => note.id === payload.noteId)!;
    const noteCategories: EntityUid[] = actionName === 'removeNoteFromCategory'
      ? note.categories.filter((catId) => catId !== payload.categoryId)
      : [...note.categories, payload.categoryId];

    return HttpService
      .patch(`/notes/${ payload.noteId }`, { categories: noteCategories })
      .then((updatedNote: NoteInterface) => {
        dispatch(noteActions[successAction]({ updatedNote, categoryId: payload.categoryId }));
        HistoryActions.push(noteActions[successAction]({ updatedNote, categoryId: payload.categoryId }))(dispatch);
        clearSelection && dispatch(NoteActions.clearSelection());
      })
      .catch((error) => {
        console.error(error);
        dispatch(noteActions[failAction]());
      });
  };
};

const removeOrRestoreMultiple = (
  actionName: 'removeMultipleNotesFromCategory' | 'restoreMultipleNotesToCategory',
  payload: RemoveMultipleNotesFromCategoryPayload,
  clearSelection: boolean,
): ActionFunction<void> => {
  const successAction = actionName + 'Success' as 'removeMultipleNotesFromCategorySuccess' | 'restoreMultipleNotesToCategorySuccess';
  const failAction = actionName + 'Fail' as 'removeMultipleNotesFromCategoryFail' | 'restoreMultipleNotesToCategoryFail';
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
            dispatch(noteActions[failAction]());
          });
      });
      resolve(true);
    })
      .then(() => {
        dispatch(noteActions[successAction]({ updatedNotes, categoryId: payload.categoryId }));
        HistoryActions.push(noteActions[successAction]({ updatedNotes, categoryId: payload.categoryId }))(dispatch);
        clearSelection && dispatch(NoteActions.clearSelection());
      })
      .catch((error) => {
        console.error(error);
        dispatch(noteActions[failAction]());
      });
  };
};

const updateOrRevert = (
  note: NoteInterface,
  actionName: 'updateNote' | 'revertNoteUpdate'
): ActionFunction<Promise<void>> => {
  const successAction = actionName + 'Success' as 'updateNoteSuccess' | 'revertNoteUpdateSuccess';
  const failAction = actionName + 'Fail' as 'updateNoteFail' | 'revertNoteUpdateFail';

  const originalNote: NoteInterface = (store.getState() as RootState).note.notes.find((n) => n.id === note.id)!;

  return function (dispatch: Dispatch): Promise<void> {
    dispatch(noteActions[actionName]());
    const _note = {
      ...note,
      updatedAt: new Date().toISOString(),
    };
    return HttpService
      .put(`/notes/${ note.id }`, _note)
      .then(() => {
        dispatch(noteActions[successAction](_note));
        HistoryActions.push(noteActions[successAction](originalNote))(dispatch);
      })
      .catch(error => {
        console.error(error);
        dispatch(noteActions[failAction]());
      });
  };
};

export default NoteActions;
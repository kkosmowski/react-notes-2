import { ActionFunction } from '../../domain/types/action-function.type';
import { Dispatch } from 'redux';
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
import { NoteSelectionMode } from '../../domain/enums/note-selection-mode.enum';
import { StorageService } from '../../services/storage.service';
import { ShowArchivedModel } from '../../domain/interfaces/show-archived.model';

const NoteActions = {
  get(): ActionFunction<void> {
    return async function (dispatch: Dispatch): Promise<void> {
      dispatch(noteActions.getNotes());

      const notes = await StorageService.getAll<NoteInterface[]>('notes');
      dispatch(noteActions.getNotesSuccess(notes));
    };
  },

  // for testing purpose only
  _getSuccess(payload: NoteInterface[]): ActionFunction<Promise<void>> {
    return async function (dispatch: Dispatch): Promise<void> {
      dispatch(noteActions.getNotesSuccess(payload));
    };
  },

  create(note: NoteInterface): ActionFunction<void> {
    return async function (dispatch: Dispatch): Promise<void> {
      dispatch(noteActions.createNote());

      await StorageService.add<NoteInterface>('notes', note);
      dispatch(noteActions.createNoteSuccess(note));
    };
  },

  toggleSelectionMode(): ActionFunction<Promise<void>> {
    return async function (dispatch: Dispatch): Promise<void> {
      dispatch(noteActions.toggleSelectionMode());
    };
  },
  setSelectionMode(mode: NoteSelectionMode): ActionFunction<Promise<void>> {
    return async function (dispatch: Dispatch): Promise<void> {
      if ((store.getState() as RootState).note.noteSelectionMode !== mode) {
        dispatch(noteActions.setSelectionMode(mode));
      }
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
    return async function (dispatch: Dispatch): Promise<void> {
      dispatch(noteActions.archiveNote());

      const note = (store.getState() as RootState).note.notes.find(n => n.id === noteId);

      if (note) {
        const part: Partial<NoteInterface> = {
          archived: true,
          archivedAt: new Date().toISOString(),
        };

        await StorageService.update<NoteInterface>('notes', { id: noteId }, part);

        dispatch(noteActions.archiveNoteSuccess({ ...note, ...part }));
        HistoryActions.push(noteActions.archiveNoteSuccess({ ...note, ...part }))(dispatch);
        dispatch(NoteActions.clearSelection());
      }
    };
  },

  deleteNote(noteId: EntityUid): ActionFunction<Promise<void>> {
    return async function (dispatch: Dispatch): Promise<void> {
      dispatch(noteActions.deleteNote());

      const deletedNote = await StorageService.update<NoteInterface>(
        'notes',
        { id: noteId },
        {
          deleted: true
        }
      );

      dispatch(noteActions.deleteNoteSuccess(deletedNote));
      HistoryActions.push(noteActions.deleteNoteSuccess(deletedNote))(dispatch);
      dispatch(NoteActions.clearSelection());
      dispatch(UiActions.checkIfSnackbarInformsAboutThis(deletedNote.id));
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

  restoreNote(data: EntityUid | NoteInterface): ActionFunction<Promise<void>> {
    let note: NoteInterface | undefined;
    let noteId: EntityUid;

    if (typeof data === 'string') {
      noteId = data;
    } else {
      note = data;
      noteId = data.id;
    }

    return async function (dispatch: Dispatch): Promise<void> {
      dispatch(noteActions.restoreNote());

      if (!note) {
        note = (store.getState() as RootState).note.notes.find(n => n.id === noteId);
      }

      if (note) {
        const part: Partial<NoteInterface> = {
          archived: false,
          archivedAt: null,
        };

        await StorageService.update<NoteInterface>('notes', { id: noteId }, part);

        dispatch(noteActions.restoreNoteSuccess({ ...note, ...part }));
        HistoryActions.push(noteActions.restoreNoteSuccess({ ...note, ...part }))(dispatch);
      }
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

  fetchShowArchived(): ActionFunction<Promise<void>> {
    return async function(dispatch: Dispatch): Promise<void> {
      dispatch(noteActions.fetchShowArchived());

      let showArchived = await StorageService.get<ShowArchivedModel>('showArchived', { id: 'showArchived' });

      if (!showArchived) {
        showArchived = await StorageService.add<ShowArchivedModel>('showArchived', { id: 'showArchived', showArchived: false });
      }

      dispatch(noteActions.fetchShowArchivedSuccess(showArchived.showArchived));
    };
  },

  setShowArchived(value: boolean): ActionFunction<Promise<void>> {
    return async function(dispatch: Dispatch): Promise<void> {
      dispatch(noteActions.setShowArchived());

      const { showArchived } = await StorageService.update<ShowArchivedModel>(
        'showArchived',
        { id: 'showArchived' },
        {
          showArchived: value
        }
      );

      dispatch(noteActions.setShowArchivedSuccess(showArchived));
    };
  },
};

const archiveOrDeleteOrRestoreMultiple = (
  noteIds: EntityUid[],
  actionName: 'archiveMultipleNotes' | 'deleteMultipleNotes' | 'restoreMultipleNotes'
): ActionFunction<Promise<void>> => {
  const successAction = actionName + 'Success' as 'archiveMultipleNotesSuccess' | 'deleteMultipleNotesSuccess' | 'restoreMultipleNotesSuccess';

  return async function (dispatch: Dispatch): Promise<void> {
    dispatch(noteActions[actionName]());

    const date = new Date().toISOString();

    await new Promise( (resolve) => {
      noteIds.forEach((noteId: EntityUid) => {
        StorageService.update<NoteInterface>(
          'notes',
          { id: noteId },
          {
            ...(actionName === 'deleteMultipleNotes'
              ? { deleted: true }
              : {
                archived: actionName === 'archiveMultipleNotes',
                archivedAt: actionName === 'archiveMultipleNotes'
                  ? date
                  : null
              }
            )
          }
        );
      });
      resolve(true);
    });

    const payload: ArchiveOrDeleteOrRestoreMultipleNotesPayload = {
      noteIds,
      ...(actionName === 'archiveMultipleNotes' && { date })
    };

    dispatch(noteActions[successAction](payload));
    HistoryActions.push(noteActions[successAction](noteIds))(dispatch);
    dispatch(NoteActions.clearSelection());
  };
};

const removeOrRestore = (
  actionName: 'removeNoteFromCategory' | 'restoreNoteToCategory',
  payload: RemoveFromCategoryPayload,
  clearSelection: boolean,
): ActionFunction<Promise<void>> => {
  const successAction = actionName + 'Success' as 'removeNoteFromCategorySuccess' | 'restoreNoteToCategorySuccess';

  return async function (dispatch: Dispatch): Promise<void> {
    dispatch(noteActions[actionName]());

    const note: NoteInterface = (store.getState() as RootState).note.notes.find((note) => note.id === payload.noteId)!;
    const noteCategories: EntityUid[] = actionName === 'removeNoteFromCategory'
      ? note.categories.filter((catId) => catId !== payload.categoryId)
      : [...note.categories, payload.categoryId];

    const updatedNote = await StorageService.update<NoteInterface>(
      'notes',
      { id: payload.noteId },
      {
        categories: noteCategories
      }
    );

    dispatch(noteActions[successAction]({ updatedNote, categoryId: payload.categoryId }));
    HistoryActions.push(noteActions[successAction]({ updatedNote, categoryId: payload.categoryId }))(dispatch);
    clearSelection && dispatch(NoteActions.clearSelection());
  };
};

const removeOrRestoreMultiple = (
  actionName: 'removeMultipleNotesFromCategory' | 'restoreMultipleNotesToCategory',
  payload: RemoveMultipleNotesFromCategoryPayload,
  clearSelection: boolean,
): ActionFunction<void> => {
  const successAction = actionName + 'Success' as 'removeMultipleNotesFromCategorySuccess' | 'restoreMultipleNotesToCategorySuccess';

  return async function (dispatch: Dispatch): Promise<void> {
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

    await new Promise((resolve) => {
      updatedNotes.forEach((note: NoteInterface) => {
        StorageService.update<NoteInterface>('notes', { id: note.id }, note);
      });
      resolve(true);
    });

    dispatch(noteActions[successAction]({ updatedNotes, categoryId: payload.categoryId }));
    HistoryActions.push(noteActions[successAction]({ updatedNotes, categoryId: payload.categoryId }))(dispatch);
    clearSelection && dispatch(NoteActions.clearSelection());
  };
};

const updateOrRevert = (
  note: NoteInterface,
  actionName: 'updateNote' | 'revertNoteUpdate'
): ActionFunction<Promise<void>> => {
  const successAction = actionName + 'Success' as 'updateNoteSuccess' | 'revertNoteUpdateSuccess';
  const originalNote: NoteInterface = (store.getState() as RootState).note.notes.find((n) => n.id === note.id)!;

  return async function (dispatch: Dispatch): Promise<void> {
    dispatch(noteActions[actionName]());
    const updatedNote = {
      ...note,
      updatedAt: new Date().toISOString(),
    };

    await StorageService.update<NoteInterface>('notes', { id: note.id }, updatedNote);

    dispatch(noteActions[successAction](updatedNote));
    HistoryActions.push(noteActions[successAction](originalNote))(dispatch);
  };
};

export default NoteActions;
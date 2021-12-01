import { NoteState } from '../interfaces/note-state.interface';
import { NoteInterface } from '../../domain/interfaces/note.interface';
import { NoteSelectionMode } from '../../domain/enums/note-selection-mode.enum';
import { createReducer, Draft } from '@reduxjs/toolkit';
import noteActions from '../actions/note.actions';
import { RemoveMultipleNotesFromCategorySuccesPayload } from '../../domain/interfaces/remove-multiple-notes-from-category-payload.interface';
import { EntityUid } from '../../domain/types/entity-uid.type';
import { ArchiveOrDeleteOrRestoreMultipleNotesPayload } from '../../domain/interfaces/archive-or-delete-or-restore-multiple-notes-payload.interface';
import { concatTwoArraysUtil } from '../../utils/concat-arrays-without-duplicates.util';

export const initialNoteState: NoteState = {
  notes: [],
  notesLoading: false,
  noteSelectionMode: NoteSelectionMode.Single,
  openedNote: null,
  noteToOpen: null,
  noteCreationInProgress: false,
  noteUpdateInProgress: false,
  noteArchivingInProgress: false,
  noteDeletionInProgress: false,
  noteRestorationInProgress: false,
  selectedNotes: {},
  noteRemovalFromCategoryInProgress: false,
  noteRestorationToCategoryInProgress: false,
  notesRemovalFromCategoryInProgress: false,
  notesRestorationToCategoryInProgress: false,
  noteUpdateRevertInProgress: false,
  showArchivedFetchInProgress: false,
  showArchivedUpdateInProgress: false,
  showArchived: false,
};

const removeOrRestoreReducer = (
  state: Draft<NoteState>,
  { payload }: { payload: NoteInterface }
) => {
  state.notes = state.notes.map((note) => note.id === payload.id
    ? payload
    : note
  );
  state.noteRestorationToCategoryInProgress = false;
};

const archiveOrDeleteOrRestoreHelper = (payload: ArchiveOrDeleteOrRestoreMultipleNotesPayload | EntityUid[]) => {
  let noteIds: EntityUid[];
  let date = '';
  if ((payload as ArchiveOrDeleteOrRestoreMultipleNotesPayload)?.noteIds) {
    noteIds = (payload as ArchiveOrDeleteOrRestoreMultipleNotesPayload).noteIds;
    date = (payload as ArchiveOrDeleteOrRestoreMultipleNotesPayload).date!;
  } else {
    noteIds = payload as EntityUid[];
  }
  return { noteIds, date };
};

const showArchivedHelper = (state: Draft<NoteState>, payload?: boolean) => {
  state.showArchived = typeof payload === 'boolean' && payload;

  if (!payload) {
    const archivedNoteIds: EntityUid[] = Object.values(state.selectedNotes)
      .filter(n => n.archived)
      .map(n => n.id);

    archivedNoteIds.forEach((id) => {
      delete state.selectedNotes[id];
    });
  }
};

const removeOrRestoreMultipleReducer = (
  state: Draft<NoteState>,
  { payload }: { payload: RemoveMultipleNotesFromCategorySuccesPayload }
) => {
  const updatedIds: EntityUid[] = payload.updatedNotes.map((note) => note.id);
  state.notes = state.notes.map((note) => updatedIds.includes(note.id)
    ? payload.updatedNotes.find((updated) => updated.id === note.id)!
    : note
  );
  state.notesRemovalFromCategoryInProgress = false;
};

const sortNotesHelper = (state: Draft<NoteState>, notes = state.notes) => {
  state.notes = notes
    .filter((note) => !note.deleted)
    .sort((noteA, noteB) => {
      const lastEditTime = (n: NoteInterface): number =>
        new Date(n.updatedAt ? n.updatedAt : n.createdAt).getTime();

      return lastEditTime(noteB) > lastEditTime(noteA) ? 1 : -1;
    });
};

const noteReducer = createReducer(initialNoteState, (builder) => {
  builder
    .addCase(noteActions.getNotes, (state) => {
      state.notesLoading = true;
    })
    .addCase(noteActions.getNotesSuccess, (state, { payload }) => {
      state.notesLoading = false;
      sortNotesHelper(state, payload);
    })

    .addCase(noteActions.createNote, (state) => {
      state.noteCreationInProgress = true;
    })
    .addCase(noteActions.createNoteSuccess, (state, action) => {
      state.noteCreationInProgress = false;
      if (action.payload) {
        state.notes = [action.payload, ...state.notes];
      }
    })

    .addCase(noteActions.toggleSelectionMode, (state) => {
      if (state.noteSelectionMode === NoteSelectionMode.Single) {
        state.noteSelectionMode = NoteSelectionMode.Multi;
      } else {
        state.noteSelectionMode = NoteSelectionMode.Single;

        const entries = Object.entries(state.selectedNotes);

        if (entries.length) {
          const [id, note] = entries[entries.length - 1];
          state.selectedNotes = { [id]: note };
        }
      }
    })
    .addCase(noteActions.setSelectionMode, (state, { payload }) => {
      state.noteSelectionMode = payload;

      if (payload === NoteSelectionMode.Single) {
        const entries = Object.entries(state.selectedNotes);

        if (entries.length) {
          const [id, note] = entries[entries.length - 1];
          state.selectedNotes = { [id]: note };
        }
      }
    })

    .addCase(noteActions.selectNote, (state, { payload }) => {
      if (state.notes.length) {
        const note = state.notes.find((note) => note.id === payload);

        if (note) {
          if (state.noteSelectionMode === NoteSelectionMode.Multi) {
            state.selectedNotes[payload] = note;
          } else {
            state.selectedNotes = { [payload]: note };
          }
        }
      }
    })
    .addCase(noteActions.selectMultipleNotes, (state, { payload }) => {
      const notes = state.notes.filter((note) => payload.includes(note.id));

      if (state.noteSelectionMode !== NoteSelectionMode.Multi) {
        state.noteSelectionMode = NoteSelectionMode.Multi;
      }
      state.selectedNotes = Object.fromEntries(notes.map((note) => [note.id, note]));
    })
    .addCase(noteActions.deselectNote, (state, { payload }) => {
      delete state.selectedNotes[payload];
    })
    .addCase(noteActions.clearSelection, (state) => {
      state.selectedNotes = {};
    })

    .addCase(noteActions.setOpenedNote, (state, action) => {
      state.openedNote = action.payload;
    })
    .addCase(noteActions.clearOpenedNote, (state) => {
      state.openedNote = null;
    })
    .addCase(noteActions.findOpenedNote, (state, { payload }) => {
      state.noteToOpen = payload;
    })

    .addCase(noteActions.updateNote, (state) => {
      state.noteUpdateInProgress = true;
    })
    .addCase(noteActions.updateNoteSuccess, (state, { payload }) => {
      state.noteUpdateInProgress = false;
      state.notes = [
        payload,
        ...state.notes.filter((note) => note.id !== payload.id),
      ];
    })

    .addCase(noteActions.updateMultipleNotes, (state) => {
      state.noteUpdateInProgress = true;
    })
    .addCase(noteActions.updateMultipleNotesSuccess, (state, { payload }) => {
      const { noteIds, part } = payload;

      state.noteUpdateInProgress = false;
      sortNotesHelper(state, state.notes.map((note) => noteIds.includes(note.id)
        ? { ...note, ...part }
        : note
      ));
    })

    .addCase(noteActions.revertNoteUpdate, (state) => {
      state.noteUpdateRevertInProgress = true;
    })
    .addCase(noteActions.revertNoteUpdateSuccess, (state, { payload }) => {
      state.noteUpdateRevertInProgress = false;

      sortNotesHelper(state, state.notes.map((note) => note.id === payload.id ? payload : note));
    })

    .addCase(noteActions.archiveNote, (state) => {
      state.noteArchivingInProgress = true;
    })
    .addCase(noteActions.archiveNoteSuccess, (state, { payload }) => {
      state.noteArchivingInProgress = false;
      state.notes = state.notes.map((note) => note.id === payload.id ? payload : note);
    })

    .addCase(noteActions.deleteNote, (state) => {
      state.noteDeletionInProgress = true;
    })
    .addCase(noteActions.deleteNoteSuccess, (state, { payload }) => {
      state.noteDeletionInProgress = false;
      state.notes = state.notes.filter((note) => note.id !== payload.id);
    })

    .addCase(noteActions.deleteMultipleNotes, (state) => {
      state.noteDeletionInProgress = true;
    })
    .addCase(noteActions.deleteMultipleNotesSuccess, (state, { payload }) => {
      state.noteDeletionInProgress = false;
      const { noteIds } = archiveOrDeleteOrRestoreHelper(payload);
      state.notes = state.notes.filter((note) => !noteIds.includes(note.id));
    })

    .addCase(noteActions.archiveMultipleNotes, (state) => {
      state.noteArchivingInProgress = true;
    })
    .addCase(noteActions.archiveMultipleNotesSuccess, (state, { payload }) => {
      state.noteArchivingInProgress = false;
      const { noteIds, date } = archiveOrDeleteOrRestoreHelper(payload);
      state.notes = state.notes.map((note) => ({
        ...note,
        archived: noteIds.includes(note.id) || note.archived,
        ...(date ? { archivedAt: date } : {}),
      }));
    })

    .addCase(noteActions.restoreMultipleNotes, (state) => {
      state.noteRestorationInProgress = true;
    })
    .addCase(noteActions.restoreMultipleNotesSuccess, (state, { payload }) => {
      state.noteRestorationInProgress = false;
      const { noteIds } = archiveOrDeleteOrRestoreHelper(payload);
      state.notes = state.notes.map((note) => ({
        ...note,
        archived: !noteIds.includes(note.id) && note.archived,
        archivedAt: undefined,
      }));
    })

    .addCase(noteActions.restoreNote, (state) => {
      state.noteRestorationInProgress = true;
    })
    .addCase(noteActions.restoreNoteSuccess, (state, { payload }) => {
      state.notes = state.notes.map((note) => note.id === payload.id ? payload : note);
      state.noteRestorationInProgress = false;
    })

    .addCase(noteActions.removeNoteFromCategory, (state) => {
      state.noteRemovalFromCategoryInProgress = true;
    })
    .addCase(noteActions.removeNoteFromCategorySuccess, removeOrRestoreReducer)

    .addCase(noteActions.restoreNoteToCategory, (state) => {
      state.noteRestorationToCategoryInProgress = true;
    })
    .addCase(noteActions.restoreNoteToCategorySuccess, removeOrRestoreReducer)

    .addCase(noteActions.removeMultipleNotesFromCategory, (state) => {
      state.notesRemovalFromCategoryInProgress = true;
    })
    .addCase(noteActions.removeMultipleNotesFromCategorySuccess, removeOrRestoreMultipleReducer)

    .addCase(noteActions.restoreMultipleNotesToCategory, (state) => {
      state.notesRemovalFromCategoryInProgress = true;
    })
    .addCase(noteActions.restoreMultipleNotesToCategorySuccess, removeOrRestoreMultipleReducer)

    .addCase(noteActions.fetchShowArchived, (state) => {
      state.showArchivedFetchInProgress = true;
    })
    .addCase(noteActions.fetchShowArchivedSuccess, (state, { payload }) => {
      state.showArchivedFetchInProgress = false;
      showArchivedHelper(state, payload);
    })

    .addCase(noteActions.setShowArchived, (state) => {
      state.showArchivedUpdateInProgress = true;
    })
    .addCase(noteActions.setShowArchivedSuccess, (state, { payload }) => {
      state.showArchivedUpdateInProgress = false;
      showArchivedHelper(state, payload);
    })

    .addCase(noteActions.addCategories, (state) => {
      state.noteUpdateInProgress = true;
    })
    .addCase(noteActions.addCategoriesSuccess, (state, { payload }) => {
      state.noteUpdateInProgress = false;
      const { noteIds, categoryIds } = payload;

      state.notes = state.notes.map((note) => noteIds.includes(note.id)
        ? { ...note, categories: concatTwoArraysUtil<EntityUid>(note.categories, categoryIds) }
        : note
      );

      for (const id in state.selectedNotes) {
        if (noteIds.includes(id)) {
          state.selectedNotes[id] = {
            ...state.selectedNotes[id],
            categories: concatTwoArraysUtil<EntityUid>(state.selectedNotes[id].categories, categoryIds)
          };
        }
      }
    })
  ;
});

export default noteReducer;

import { NoteState } from '../interfaces/note-state.interface';
import { NoteInterface } from '../../domain/interfaces/note.interface';
import { NoteSelectionMode } from '../../domain/enums/note-selection-mode.enum';
import { createReducer, Draft } from '@reduxjs/toolkit';
import noteActions from '../actions/note.actions';
import { RemoveFromCategorySuccessPayload } from '../../domain/interfaces/remove-from-category-payload.interface';
import { RemoveMultipleNotesFromCategorySuccesPayload } from '../../domain/interfaces/remove-multiple-notes-from-category-payload.interface';
import { EntityUid } from '../../domain/types/entity-uid.type';
import { ArchiveOrDeleteOrRestoreMultipleNotesPayload } from '../../domain/interfaces/archive-or-delete-or-restore-multiple-notes-payload.interface';

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
  showArchived: false,
};

const removeOrRestoreReducer = (
  state: Draft<NoteState>,
  { payload }: { payload: RemoveFromCategorySuccessPayload }
) => {
  state.notes = state.notes.map((note) => note.id === payload.updatedNote.id
    ? payload.updatedNote
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

const noteReducer = createReducer(initialNoteState, (builder) => {
  builder
    .addCase(noteActions.getNotes, (state) => {
      state.notesLoading = true;
    })
    .addCase(noteActions.getNotesSuccess, (state, action) => {
      state.notesLoading = false;
      if (action.payload) {
        state.notes = (action.payload as NoteInterface[]).filter((note) => !note.deleted).reverse();
      }
    })
    .addCase(noteActions.getNotesFail, (state) => {
      state.notesLoading = false;
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
    .addCase(noteActions.createNoteFail, (state) => {
      state.noteCreationInProgress = false;
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
    .addCase(noteActions.selectNote, (state, { payload }) => {
      const note = state.notes.find((note) => note.id === payload)!;

      if (state.noteSelectionMode === NoteSelectionMode.Multi) {
        state.selectedNotes[payload] = note;
      } else {
        state.selectedNotes = { [payload]: note };
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
    .addCase(noteActions.updateNoteSuccess, (state, action) => {
      state.noteUpdateInProgress = false;
      if (action.payload) {
        const updated: NoteInterface = action.payload;
        state.notes = state.notes.map((note) => note.id === updated.id ? updated : note);
      }
    })
    .addCase(noteActions.updateNoteFail, (state) => {
      state.noteUpdateInProgress = false;
    })

    .addCase(noteActions.revertNoteUpdate, (state) => {
      state.noteUpdateRevertInProgress = true;
    })
    .addCase(noteActions.revertNoteUpdateSuccess, (state, { payload }) => {
      state.noteUpdateRevertInProgress = false;
      state.notes = state.notes.map((note) => note.id === payload.id ? payload : note);
    })
    .addCase(noteActions.revertNoteUpdateFail, (state) => {
      state.noteUpdateRevertInProgress = false;
    })

    .addCase(noteActions.archiveNote, (state) => {
      state.noteArchivingInProgress = true;
    })
    .addCase(noteActions.archiveNoteSuccess, (state, { payload }) => {
      state.noteArchivingInProgress = false;
      state.notes = state.notes.map((note) => note.id === payload.id ? payload : note);
    })
    .addCase(noteActions.archiveNoteFail, (state) => {
      state.noteArchivingInProgress = false;
    })

    .addCase(noteActions.deleteNote, (state) => {
      state.noteDeletionInProgress = true;
    })
    .addCase(noteActions.deleteNoteSuccess, (state, { payload }) => {
      state.noteDeletionInProgress = false;
      state.notes = state.notes.filter((note) => note.id !== payload.id);
    })
    .addCase(noteActions.deleteNoteFail, (state) => {
      state.noteDeletionInProgress = false;
    })

    .addCase(noteActions.deleteMultipleNotes, (state) => {
      state.noteDeletionInProgress = true;
    })
    .addCase(noteActions.deleteMultipleNotesSuccess, (state, { payload }) => {
      state.noteDeletionInProgress = false;
      const { noteIds } = archiveOrDeleteOrRestoreHelper(payload);
      state.notes = state.notes.filter((note) => !noteIds.includes(note.id));
    })
    .addCase(noteActions.deleteMultipleNotesFail, (state) => {
      state.noteDeletionInProgress = false;
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
    .addCase(noteActions.archiveMultipleNotesFail, (state) => {
      state.noteArchivingInProgress = false;
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
    .addCase(noteActions.restoreMultipleNotesFail, (state) => {
      state.noteRestorationInProgress = false;
    })

    .addCase(noteActions.restoreNote, (state) => {
      state.noteRestorationInProgress = true;
    })
    .addCase(noteActions.restoreNoteSuccess, (state, { payload }) => {
      const restored: NoteInterface = {
        ...payload,
        archived: false,
        archivedAt: undefined,
      };
      state.notes = state.notes.map((note) => note.id === restored.id ? restored : note);
      state.noteRestorationInProgress = false;
    })
    .addCase(noteActions.restoreNoteFail, (state) => {
      state.noteRestorationInProgress = false;
    })

    .addCase(noteActions.removeNoteFromCategory, (state) => {
      state.noteRemovalFromCategoryInProgress = true;
    })
    .addCase(noteActions.removeNoteFromCategorySuccess, removeOrRestoreReducer)
    .addCase(noteActions.removeNoteFromCategoryFail, (state) => {
      state.noteRemovalFromCategoryInProgress = false;
    })

    .addCase(noteActions.restoreNoteToCategory, (state) => {
      state.noteRestorationToCategoryInProgress = true;
    })
    .addCase(noteActions.restoreNoteToCategorySuccess, removeOrRestoreReducer)
    .addCase(noteActions.restoreNoteToCategoryFail, (state) => {
      state.noteRestorationToCategoryInProgress = false;
    })

    .addCase(noteActions.removeMultipleNotesFromCategory, (state) => {
      state.notesRemovalFromCategoryInProgress = true;
    })
    .addCase(noteActions.removeMultipleNotesFromCategorySuccess, removeOrRestoreMultipleReducer)
    .addCase(noteActions.removeMultipleNotesFromCategoryFail, (state) => {
      state.notesRemovalFromCategoryInProgress = false;
    })

    .addCase(noteActions.restoreMultipleNotesToCategory, (state) => {
      state.notesRemovalFromCategoryInProgress = true;
    })
    .addCase(noteActions.restoreMultipleNotesToCategorySuccess, removeOrRestoreMultipleReducer)
    .addCase(noteActions.restoreMultipleNotesToCategoryFail, (state) => {
      state.notesRemovalFromCategoryInProgress = false;
    })

    .addCase(noteActions.setShowArchived, (state, { payload }) => {
      state.showArchived = payload;

      if (!payload) {
        const archivedNoteIds: EntityUid[] = Object.values(state.selectedNotes)
          .filter(n => n.archived)
          .map(n => n.id);
        archivedNoteIds.forEach((id) => {
          delete state.selectedNotes[id];
        });
      }
    });
});

export default noteReducer;

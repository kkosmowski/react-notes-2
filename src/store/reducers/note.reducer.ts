import { NoteState } from '../interfaces/note-state.interface';
import { NoteInterface } from '../../domain/interfaces/note.interface';
import { NoteSelectionMode } from '../../domain/enums/note-selection-mode.enum';
import { createReducer, Draft } from '@reduxjs/toolkit';
import noteActions from '../actions/note.actions';
import { RemoveFromCategorySuccessPayload } from '../../domain/interfaces/remove-from-category-payload.interface';
import { RemoveMultipleNotesFromCategorySuccesPayload } from '../../domain/interfaces/remove-multiple-notes-from-category-payload.interface';
import { EntityUid } from '../../domain/types/entity-uid.type';

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
          const [id] = entries[entries.length - 1];
          state.selectedNotes = { [id]: true };
        }
      }
    })
    .addCase(noteActions.selectNote, (state, { payload }) => {
      if (state.noteSelectionMode === NoteSelectionMode.Multi) {
        state.selectedNotes[payload] = true;
      } else {
        state.selectedNotes = { [payload]: true };
      }
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
      state.notes = state.notes.map((note) => ({
        ...note,
        deleted: payload.includes(note.id) || note.deleted,
      }));
    })
    .addCase(noteActions.deleteMultipleNotesFail, (state) => {
      state.noteDeletionInProgress = false;
    })

    .addCase(noteActions.restoreMultipleNotes, (state) => {
      state.noteRestorationInProgress = true;
    })
    .addCase(noteActions.restoreMultipleNotesSuccess, (state, { payload }) => {
      state.noteRestorationInProgress = false;
      state.notes = state.notes.map((note) => ({
        ...note,
        deleted: !payload.includes(note.id) && note.deleted,
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
        archived: false
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
    });
});

export default noteReducer;

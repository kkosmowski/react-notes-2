import { NoteState } from '../interfaces/note-state.interface';
import { NoteInterface } from '../../domain/interfaces/note.interface';
import { NoteSelectionMode } from '../../domain/enums/note-selection-mode.enum';
import { createReducer } from '@reduxjs/toolkit';
import noteActions from '../actions/note.actions';

const initialState: NoteState = {
  notes: [],
  notesLoading: false,
  noteSelectionMode: NoteSelectionMode.Single,
  openedNote: null,
  noteCreationInProgress: false,
  noteUpdateInProgress: false,
  noteDeletionInProgress: false,
  noteRestorationInProgress: false,
  selectedNotes: {}
};

const noteReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(noteActions.getNotes, (state) => {
      state.notesLoading = true;
    })
    .addCase(noteActions.getNotesSuccess, (state, action) => {
      state.notesLoading = false;
      if (action.payload) {
        state.notes = (action.payload as NoteInterface[]).reverse();
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

    .addCase(noteActions.changeSelectionMode, (state, action) => {
      if (action.payload) {
        state.noteSelectionMode = action.payload;
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
      state.selectedNotes[payload] = false;
    })
    .addCase(noteActions.clearSelection, (state) => {
      state.selectedNotes = {};
    })

    .addCase(noteActions.setOpenedNote, (state, action) => {
      state.openedNote = action.payload || null;
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

    .addCase(noteActions.deleteNote, (state) => {
      state.noteDeletionInProgress = true;
    })
    .addCase(noteActions.deleteNoteSuccess, (state, { payload }) => {
      state.noteDeletionInProgress = false;
      state.notes = state.notes.map((note) => note.id === payload.id ? payload : note);
    })
    .addCase(noteActions.deleteNoteFail, (state) => {
      state.noteDeletionInProgress = false;
    })

    .addCase(noteActions.restoreNote, (state) => {
      state.noteRestorationInProgress = true;
    })
    .addCase(noteActions.restoreNoteSuccess, (state, { payload }) => {
      const restored: NoteInterface = {
        ...payload,
        deleted: false
      };
      state.notes = state.notes.map((note) => note.id === restored.id ? restored : note);
      state.noteRestorationInProgress = false;
    })
    .addCase(noteActions.restoreNoteFail, (state) => {
      state.noteRestorationInProgress = false;
    });
});

export default noteReducer;

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
};

const noteReducer = createReducer(initialState, (builder) => {
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

    .addCase(noteActions.changeSelectionMode, (state, action) => {
      if (action.payload) {
        state.noteSelectionMode = action.payload;
      }
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
    .addCase(noteActions.deleteNoteSuccess, (state, action) => {
      state.noteDeletionInProgress = false;
      if (action.payload) {
        state.notes = state.notes.filter((note) => note.id !== action.payload);
      }
    })
    .addCase(noteActions.deleteNoteFail, (state) => {
      state.noteDeletionInProgress = false;
    });
});

export default noteReducer;

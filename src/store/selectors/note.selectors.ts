import { createSelector } from 'reselect';
import { RootState } from '../interfaces/root-state.interface';
import { NoteState } from '../interfaces/note-state.interface';

const noteSelector = (state: RootState) => state.note;

export const selectNotes = createSelector(
  noteSelector, (note: NoteState) => note.notes
);

export const selectNotesLoading = createSelector(
  noteSelector, (note: NoteState) => note.notesLoading
);

export const selectOpenedNote = createSelector(
  noteSelector, (note: NoteState) => note.openedNote
);

export const selectNoteSelectionMode = createSelector(
  noteSelector, (note: NoteState) => note.noteSelectionMode
);
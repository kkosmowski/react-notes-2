import { createSelector } from 'reselect';
import { RootState } from '../interfaces/root-state.interface';
import { NoteState } from '../interfaces/note-state.interface';

const selector = (state: RootState) => state.note;

export const selectNotes = createSelector(
  selector, (note: NoteState) => note.notes
);

export const selectNotesLoading = createSelector(
  selector, (note: NoteState) => note.notesLoading
);

export const selectOpenedNote = createSelector(
  selector, (note: NoteState) => note.openedNote
);

export const selectNoteSelectionMode = createSelector(
  selector, (note: NoteState) => note.noteSelectionMode
);
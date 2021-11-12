import { createSelector } from 'reselect';
import { RootState } from '../interfaces/root-state.interface';
import { NoteState } from '../interfaces/note-state.interface';

const noteSelector = (state: RootState) => state.note;

export const selectNotes = createSelector(
  noteSelector, (note: NoteState) => note.showArchived
    ? note.notes
    : note.notes.filter((n) => !n.archived)
);

export const selectNotesLoading = createSelector(
  noteSelector, (note: NoteState) => note.notesLoading
);

// @todo remove if redundant
// export const selectShowArchived = createSelector(
//   noteSelector, (note: NoteState) => note.showArchived
// );

export const selectOpenedNote = createSelector(
  noteSelector, (note: NoteState) => note.openedNote
);
export const selectNoteToOpen = createSelector(
  noteSelector, (note: NoteState) => note.noteToOpen
);

export const selectNoteSelectionMode = createSelector(
  noteSelector, (note: NoteState) => note.noteSelectionMode
);

export const selectSelectedNotes = createSelector(
  noteSelector, (note: NoteState) => note.selectedNotes
);
export const selectSelectedNotesCount = createSelector(
  noteSelector, (note: NoteState) => Object.values(note.selectedNotes).length
);
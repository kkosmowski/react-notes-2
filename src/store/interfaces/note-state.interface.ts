import { NoteInterface } from '../../domain/interfaces/note.interface';
import { NoteSelectionMode } from '../../domain/enums/note-selection-mode.enum';

export interface NoteState {
  notes: NoteInterface[];
  notesLoading: boolean;
  noteSelectionMode: NoteSelectionMode;
  openedNote: NoteInterface | null;
  noteCreationInProgress: boolean;
}
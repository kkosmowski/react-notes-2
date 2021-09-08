import { NoteInterface } from '../../domain/interfaces/note.interface';

export interface NoteState {
  notes: NoteInterface[];
  notesLoading: boolean;
  openedNote: NoteInterface | null;
  noteCreationInProgress: boolean;
}
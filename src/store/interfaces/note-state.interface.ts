import { Note } from '../../domain/interfaces/note.interface';

export interface NoteState {
  notes: Note[];
  openedNote: Note | null;
  noteCreationInProgress: boolean;
}
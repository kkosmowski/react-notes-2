import { NoteInterface } from '../../domain/interfaces/note.interface';
import { NoteSelectionMode } from '../../domain/enums/note-selection-mode.enum';
import { EntityUid } from '../../domain/types/entity-uid.type';

export interface NoteState {
  notes: NoteInterface[];
  notesLoading: boolean;
  noteSelectionMode: NoteSelectionMode;
  openedNote: NoteInterface | null;
  noteCreationInProgress: boolean;
  noteUpdateInProgress: boolean;
  noteDeletionInProgress: boolean;
  noteRestorationInProgress: boolean;
  selectedNotes: Record<EntityUid, boolean>;
}
import { NoteSelectionMode } from '../enums/note-selection-mode.enum';

export interface NoteSelectionProps {
  selectionMode: NoteSelectionMode;
  isSelected: boolean;
  isArchived?: boolean;
}
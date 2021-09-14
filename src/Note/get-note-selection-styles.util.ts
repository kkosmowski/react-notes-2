import { NoteSelectionProps } from '../domain/interfaces/note-selection-props.interface';
import { NoteSelectionMode } from '../domain/enums/note-selection-mode.enum';

export const getNoteSelectionStyles = ({ isSelected, selectionMode }: NoteSelectionProps): string => {
  let styles: string = 'box-shadow: inset 0 0 0 1px ';

  if (isSelected) {
    return styles + 'var(--primary300);';
  }
  return selectionMode === NoteSelectionMode.Multi
    ? styles + 'var(--dark400);'
    : '';
};
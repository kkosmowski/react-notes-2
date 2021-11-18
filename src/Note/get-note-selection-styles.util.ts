import { NoteSelectionProps } from '../domain/interfaces/note-selection-props.interface';
import { NoteSelectionMode } from '../domain/enums/note-selection-mode.enum';

export const getNoteSelectionStyles = (
  { isSelected, isSelectionCovered, selectionMode }: NoteSelectionProps
): string => {
  const styles = 'box-shadow: inset 0 0 0 1px ';

  if (isSelected ) {
    return styles + 'var(--primary300);';
  } else if (isSelectionCovered) {
    return styles + 'var(--primary700);';
  }

  return selectionMode === NoteSelectionMode.Multi ? styles + 'var(--background400);' : '';
};
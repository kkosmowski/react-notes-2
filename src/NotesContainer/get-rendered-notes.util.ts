import { RenderedNote } from '../domain/interfaces/rendered-note.interface';
import { NoteInterface } from '../domain/interfaces/note.interface';

export const getRenderedNotes = (currentCategoryNotes: NoteInterface[]): RenderedNote[] => {
  const notes: RenderedNote[] = [];
  const noteElements: Element[] = Array.from(document.getElementsByClassName('note'));

  noteElements.forEach((note, index) => {
    if (currentCategoryNotes[index]) {
      const { top, left, width, height } = note.getBoundingClientRect();
      notes.push({ top, left, width, height, id: currentCategoryNotes[index].id });
    }
  });

  return notes;
};

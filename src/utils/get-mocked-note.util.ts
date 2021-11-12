import { NoteInterface } from '../domain/interfaces/note.interface';
import { v4 } from 'uuid';

export const getMockedNote = (partial: Partial<NoteInterface> = {}): NoteInterface => ({
  id: v4(),
  title: 'Mocked note title',
  content: 'Mocked note content',
  deleted: false,
  categories: [],
  ...partial,
});
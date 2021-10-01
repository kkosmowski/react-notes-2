import { NoteInterface } from '../domain/interfaces/note.interface';
import { v4 } from 'uuid';

export const getMockedNote = (): NoteInterface => ({
  id: v4(),
  title: 'Mocked note title',
  content: 'Mocked note content',
  deleted: false,
  categories: [],
});
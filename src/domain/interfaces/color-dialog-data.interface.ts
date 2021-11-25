import { Category } from './category.interface';
import { NoteInterface } from './note.interface';

export interface ColorDialogData {
  type: 'category' | 'note';
  data: Category | NoteInterface;
}
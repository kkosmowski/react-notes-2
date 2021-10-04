import { EntityUid } from '../types/entity-uid.type';
import { NoteInterface } from './note.interface';

export interface RemoveFromCategoryPayload {
  noteId: EntityUid;
  categoryId: EntityUid;
}

export interface RemoveFromCategorySuccessPayload {
  updatedNote: NoteInterface;
  categoryId: EntityUid;
}
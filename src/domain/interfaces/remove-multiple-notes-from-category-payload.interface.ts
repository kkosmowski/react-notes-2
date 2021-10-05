import { EntityUid } from '../types/entity-uid.type';
import { NoteInterface } from './note.interface';

export interface RemoveMultipleNotesFromCategoryPayload {
  noteIds: EntityUid[];
  categoryId: EntityUid;
}

export interface RemoveMultipleNotesFromCategorySuccesPayload {
  updatedNotes: NoteInterface[];
  categoryId: EntityUid;
}
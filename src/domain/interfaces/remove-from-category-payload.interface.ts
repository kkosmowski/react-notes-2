import { EntityUid } from '../types/entity-uid.type';

export interface RemoveFromCategoryPayload {
  noteId: EntityUid;
  categoryId: EntityUid;
}
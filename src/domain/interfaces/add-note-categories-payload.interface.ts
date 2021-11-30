import { EntityUid } from '../types/entity-uid.type';

export interface AddNoteCategoriesPayload {
  noteIds: EntityUid[];
  categoryIds: EntityUid[];
}
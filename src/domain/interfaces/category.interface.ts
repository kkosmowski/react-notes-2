import { EntityUid } from '../types/entity-uid.type';

export interface Category {
  id: EntityUid;
  name: string;
  notes: EntityUid[] | null; // null for rootCategory
}
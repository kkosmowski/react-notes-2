import { EntityUid } from '../types/entity-uid.type';

export interface Category {
  id: EntityUid;
  name: string;
  deleted: boolean;
  color?: string;
}
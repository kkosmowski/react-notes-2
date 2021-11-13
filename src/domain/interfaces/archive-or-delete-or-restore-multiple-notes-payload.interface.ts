import { EntityUid } from '../types/entity-uid.type';

export interface ArchiveOrDeleteOrRestoreMultipleNotesPayload {
  noteIds: EntityUid[];
  date?: string;
}
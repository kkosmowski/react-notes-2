import { EntityUid } from '../types/entity-uid.type';
import { NoteInterface } from './note.interface';

export interface UpdateMultipleNotesPayload {
  noteIds: EntityUid[];
  update: Partial<NoteInterface>;
}
import { NoteDialogFormValue } from './note-dialog-form.interface';
import { EntityUid } from '../types/entity-uid.type';

export interface NoteInterface extends NoteDialogFormValue {
  id: EntityUid;
  archived: boolean;
  deleted: boolean;
}
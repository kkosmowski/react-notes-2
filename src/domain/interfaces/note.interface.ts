import { NoteDialogFormValue } from '../../NoteDialog/note-dialog-form.interface';
import { EntityUid } from '../types/entity-uid.type';

export interface Note extends NoteDialogFormValue {
  id: EntityUid;
}
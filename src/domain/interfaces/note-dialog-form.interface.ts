import { EntityUid } from '../types/entity-uid.type';

export interface NoteDialogFormValue {
  title: string;
  content: string;
  categories: EntityUid[];
}
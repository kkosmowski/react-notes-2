import { EntityUid } from '../domain/types/entity-uid.type';

export interface NoteDialogFormValue {
  title: string;
  content: string;
  categories: EntityUid[];
}
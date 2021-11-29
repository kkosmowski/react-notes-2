import { Category } from './category.interface';
import { NoteInterface } from './note.interface';
import { EntityUid } from '../types/entity-uid.type';
import { ColorDialogType } from '../enums/color-dialog-type.enum';

export interface ColorDialogData {
  type: ColorDialogType;
  data: Category | NoteInterface | EntityUid[];
}
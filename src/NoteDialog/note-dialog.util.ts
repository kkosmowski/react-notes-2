import { NoteDialogFormValue } from '../domain/interfaces/note-dialog-form.interface';

export class NoteDialogUtil {
  static isFormValid(form: NoteDialogFormValue): boolean {
    return this.isFieldValid(form.title);
  }

  static isFieldValid(value: string): boolean {
    return value.trim().length !== 0;
  }
}
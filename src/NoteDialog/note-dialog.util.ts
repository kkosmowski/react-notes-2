import { NoteDialogFormValue } from '../domain/interfaces/note-dialog-form.interface';

export class NoteDialogUtil {
  static isFormValid(form: NoteDialogFormValue): boolean {
    return this.isFieldValid(form.title) && this.isFieldValid(form.content);
  }

  static isFieldValid(value: string): boolean {
    return value.trim().length !== 0;
  }
}
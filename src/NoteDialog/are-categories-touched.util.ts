import { NoteDialogFormValue } from '../domain/interfaces/note-dialog-form.interface';
import { Category } from '../domain/interfaces/category.interface';

export const areCategoriesTouched = (
  initial: NoteDialogFormValue,
  form: NoteDialogFormValue,
  categories: Category[],
): boolean => {
  if (initial.categories.length !== form.categories.length) return true;

  for (const category of categories) {
    const onlyInitialFormIncludes = initial.categories.includes(category.id)
      && !form.categories.includes(category.id);

    const onlyCurrentFormIncludes = !initial.categories.includes(category.id)
      && form.categories.includes(category.id);

    if (onlyInitialFormIncludes || onlyCurrentFormIncludes) {
      return true;
    }
  }

  return false;
};
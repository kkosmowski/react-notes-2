import { ChangeEvent, ReactElement, useEffect, useRef, useState } from 'react';
import { Input } from '../Input/Input';
import { NoteDialogFormValue } from '../domain/interfaces/note-dialog-form.interface';
import { Category } from '../domain/interfaces/category.interface';
import { useTranslation } from 'react-i18next';
import {
  isContentEdited,
  isEditMode,
  isEditModeBoth,
  isTitleEdited,
  NoteEditMode
} from '../domain/interfaces/note-edit-mode.interface';
import { InputOrTextarea } from '../domain/types/input-or-textarea.type';
import { Checkbox, CheckboxLabel } from '../Checkbox/Checkbox';
import { EntityUid } from '../domain/types/entity-uid.type';
import { Categories, CategoriesWrapper, FormWrapper } from './NoteDialogForm.styled';
import { NoteDialogUtil } from './note-dialog.util';
import { NoteInterface } from '../domain/interfaces/note.interface';
import {
  noteDialogContentInputTestId,
  noteDialogTitleInputTestId
} from '../domain/consts/test-ids.consts';

export interface NoteDialogFormPayload {
  form: NoteDialogFormValue;
  valid: boolean;
}

interface Props {
  initialForm: NoteDialogFormValue;
  openedNote: NoteInterface | null;
  categories: Category[];
  editMode: NoteEditMode;
  clear: void[];
  onFormChange: (payload: NoteDialogFormPayload) => void;
  onPartialEditModeChange: (mode: NoteEditMode) => void;
}

export const NoteDialogForm = (
  { initialForm, openedNote, clear, categories, editMode, onFormChange, onPartialEditModeChange }: Props
): ReactElement => {
  const { t } = useTranslation('NOTE_DIALOG');
  const initialRun = useRef<boolean>(true);
  const [form, setForm] = useState<NoteDialogFormValue>({
    title: initialForm.title,
    content: initialForm.content,
    categories: initialForm.categories,
  });

  useEffect(() => {
    onFormChange({
      form,
      valid: NoteDialogUtil.isFormValid(form)
    });
  }, [form]);

  useEffect(() => {
    if (!initialRun.current) {
      setForm({
        title: initialForm.title,
        content: initialForm.content,
        categories: initialForm.categories,
      });
    } else {
      initialRun.current = false;
    }
  }, [clear]);

  useEffect(() => {
    if (openedNote) {
      setForm({
        title: openedNote.title,
        content: openedNote.content,
        categories: openedNote.categories,
      });
    }
  }, [openedNote]);

  const handleChange = (e: ChangeEvent<InputOrTextarea>): void => {
    setForm({
      ...form,
      [e.target.id]: e.target.value
    });
  };

  const handleCategoriesChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newCategories: EntityUid[] = form.categories.includes(e.target.value)
      ? form.categories.filter((id) => id !== e.target.value)
      : [...form.categories, e.target.value];

    setForm({
      ...form,
      categories: newCategories,
    });
  };

  const handleEditModeChange = (id: EntityUid, disabled?: boolean): void => {
    if (!disabled) return;

    let mode: NoteEditMode;

    switch (id) {
      case 'title': {
        mode = NoteEditMode.Title;
        break;
      }
      case 'content': {
        mode = NoteEditMode.Content;
        break;
      }
      default:
        mode = NoteEditMode.None;
        break;
    }
    onPartialEditModeChange(mode);
  };

  return (
    <FormWrapper>
      <Input
        id="title"
        onChange={ handleChange }
        onDoubleClick={ handleEditModeChange }
        value={ form.title }
        label={ t('TITLE') }
        disabled={ !isTitleEdited(editMode) }
        autofocus={ !openedNote || isEditMode(editMode) }
        required
        testid={ noteDialogTitleInputTestId }
      />

      <Input
        id="content"
        onChange={ handleChange }
        onDoubleClick={ handleEditModeChange }
        value={ form.content }
        label={ t('CONTENT') }
        type="textarea"
        disabled={ !isContentEdited(editMode) }
        testid={ noteDialogContentInputTestId }
      />

      <CategoriesWrapper>
        <p>{ t('CATEGORIES') }</p>
        <Categories>
          { categories.map((category) => (
            <CheckboxLabel key={ category.id }>
              <Checkbox
                onChange={ handleCategoriesChange }
                type="checkbox"
                id="category"
                name={ category.id }
                value={ category.id }
                checked={ form.categories.includes(category.id) }
                disabled={ !isEditModeBoth(editMode) }
              />
              { category.name }
            </CheckboxLabel>
          )) }
        </Categories>
      </CategoriesWrapper>
    </FormWrapper>
  );
};
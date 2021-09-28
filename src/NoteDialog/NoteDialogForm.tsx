import { ChangeEvent, ReactElement, useEffect, useRef, useState } from 'react';
import { InputWithLabel } from '../InputWithLabel/InputWithLabel';
import { NoteDialogFormValue } from '../domain/interfaces/note-dialog-form.interface';
import { Category } from '../domain/interfaces/category.interface';
import { useTranslation } from 'react-i18next';
import {
  isContentEdited,
  isEditModeBoth,
  isTitleEdited,
  NoteEditMode
} from '../domain/interfaces/note-edit-mode.interface';
import { InputOrTextarea } from '../domain/types/input-or-textarea.type';
import { Checkbox, CheckboxLabel } from '../Checkbox/Checkbox';
import { EntityUid } from '../domain/types/entity-uid.type';
import { Categories, CategoriesWrapper, FormWrapper } from './NoteDialogForm.styled';
import { NoteDialogUtil } from './note-dialog.util';

export interface NoteDialogFormPayload {
  form: NoteDialogFormValue;
  valid: boolean;
}

interface Props {
  initialForm: NoteDialogFormValue;
  categories: Category[];
  editMode: NoteEditMode;
  clear: void[];
  onFormChange: (payload: NoteDialogFormPayload) => void;
  onPartialEditModeChange: (mode: NoteEditMode) => void;
}

export const NoteDialogForm = (
  { initialForm, clear, categories, editMode, onFormChange, onPartialEditModeChange }: Props
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

  const handleEditModeChange = (id: string): void => {
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
      <InputWithLabel
        id="title"
        onChange={ handleChange }
        onDoubleClick={ handleEditModeChange }
        value={ form.title }
        label={ t('TITLE') }
        required={ true }
        disabled={ !isTitleEdited(editMode) }
      />

      <InputWithLabel
        id="content"
        onChange={ handleChange }
        onDoubleClick={ handleEditModeChange }
        value={ form.content }
        label={ t('CONTENT') }
        type="textarea"
        required={ true }
        disabled={ !isContentEdited(editMode) }
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
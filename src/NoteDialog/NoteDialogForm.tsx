import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { InputWithLabel } from '../InputWithLabel/InputWithLabel';
import styled from 'styled-components';
import { NoteDialogFormValue } from '../domain/interfaces/note-dialog-form.interface';
import { Category } from '../domain/interfaces/category.interface';
import { useTranslation } from 'react-i18next';
import { SelectedCategories } from '../domain/types/selected-categories.type';
import { getSelectedCategoriesIds } from '../utils/get-selected-categories-ids.util';
import {
  isContentEdited,
  isEditModeBoth,
  isTitleEdited,
  NoteEditMode
} from '../domain/interfaces/note-edit-mode.interface';
import { InputOrTextarea } from '../domain/types/input-or-textarea.type';
import { Checkbox, CheckboxLabel } from '../Checkbox/Checkbox';
import { EntityUid } from '../domain/types/entity-uid.type';

interface Props {
  initialForm: NoteDialogFormValue;
  categories: Category[];
  editMode: NoteEditMode;
  clear: void[];
  onFormChange: (form: NoteDialogFormValue) => void;
  onPartialEditModeChange: (mode: NoteEditMode) => void;
}

export const NoteDialogForm = (
  { initialForm, clear, categories, editMode, onFormChange, onPartialEditModeChange }: Props
): ReactElement => {
  const { t } = useTranslation('NOTE_DIALOG');
  const [form, setForm] = useState<NoteDialogFormValue>(initialForm);

  useEffect(() => {
    onFormChange(form);
  }, [form]);

  useEffect(() => {
    setForm(initialForm);
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
        disabled={ !isTitleEdited(editMode) }
      />

      <InputWithLabel
        id="content"
        onChange={ handleChange }
        onDoubleClick={ handleEditModeChange }
        value={ form.content }
        label={ t('CONTENT') }
        type="textarea"
        disabled={ !isContentEdited(editMode) }
      />

      {/* @todo fix categories selection (when selecting category and editing title/content, selection is lost) */ }
      <CategoriesWrapper> {/* @todo style the category checkboxes */ }
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

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 24px 0;
  flex: 1;
  overflow: hidden;

  > *:not(:last-child) {
    margin-bottom: 32px;
  }
`;

const CategoriesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  > p {
    margin-bottom: 8px;
  }
`;

const Categories = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;

  > * {
    margin-bottom: 4px;
  }
`;
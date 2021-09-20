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
  const [selectedCategories, setSelectedCategories] = useState<SelectedCategories>({});

  useEffect(() => {
    if (form.categories.length) {
      setInitialSelectedCategories();
    }
  }, [form]);

  useEffect(() => {
    onFormChange({
      ...form,
      categories: getSelectedCategoriesIds(selectedCategories)
    });
  }, [form, selectedCategories]);

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
    setSelectedCategories({
      ...selectedCategories,
      [e.target.value]: e.target.checked
    });
  };

  const setInitialSelectedCategories = (): void => {
    const _selectedCategories: SelectedCategories = {};

    form.categories.forEach((categoryId) => {
      _selectedCategories[categoryId] = true;
    });

    setSelectedCategories(_selectedCategories);
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
        <label>{ t('CATEGORIES') }</label>
        { categories.map((category) => (
          <label key={ category.id }>
            <input
              onChange={ handleCategoriesChange }
              type="checkbox"
              id="category"
              name={ category.id }
              value={ category.id }
              checked={ selectedCategories[category.id] || false }
              disabled={ !isEditModeBoth(editMode) }
            />
            { category.name }
          </label>
        )) }
      </CategoriesWrapper>
    </FormWrapper>
  );
};

const FormWrapper = styled.div`
  margin: 24px 0;
  flex: 1;
  overflow: auto;

  > *:not(:last-child) {
    margin-bottom: 32px;
  }
`;

const CategoriesWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { InputWithLabel } from '../InputWithLabel/InputWithLabel';
import styled from 'styled-components';
import { NoteDialogFormValue } from '../domain/interfaces/note-dialog-form.interface';
import { Category } from '../domain/interfaces/category.interface';
import { useTranslation } from 'react-i18next';
import { SelectedCategories } from '../domain/types/selected-categories.type';
import { getSelectedCategoriesIds } from '../utils/get-selected-categories-ids.util';

interface Props {
  initialForm: NoteDialogFormValue;
  categories: Category[];
  isEditMode: boolean;
  clear: void[];
  onFormChange: (form: NoteDialogFormValue) => void;
}

export const NoteDialogForm = ({ initialForm, clear, categories, isEditMode, onFormChange }: Props): ReactElement => {
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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
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

  return (
    <FormWrapper>
      <InputWithLabel
        id="title"
        onChange={ handleChange }
        value={ form.title }
        label={ t('TITLE') }
        disabled={ !isEditMode }
      />

      <InputWithLabel
        id="content"
        onChange={ handleChange }
        value={ form.content }
        label={ t('CONTENT') }
        type="textarea"
        disabled={ !isEditMode }
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
              disabled={ !isEditMode }
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
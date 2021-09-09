import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { InputWithLabel } from '../InputWithLabel/InputWithLabel';
import styled from 'styled-components';
import { NoteDialogFormValue } from '../domain/interfaces/note-dialog-form.interface';
import { Category } from '../domain/interfaces/category.interface';
import { useTranslation } from 'react-i18next';
import { SelectedCategories } from '../domain/types/selected-categories.type';

interface Props {
  initialForm: NoteDialogFormValue;
  categories: Category[];
  onFormChange: (form: NoteDialogFormValue) => void;
  onCategoriesChange: (categories: SelectedCategories) => void;
  clear: void[];
}

export const NoteDialogForm = ({ initialForm, clear, categories, onFormChange, onCategoriesChange }: Props): ReactElement => {
  const { t } = useTranslation('NOTE_DIALOG');
  const [form, setForm] = useState<NoteDialogFormValue>(initialForm);
  const [selectedCategories, setSelectedCategories] = useState<SelectedCategories>({});

  useEffect(() => {
    onFormChange(form);
  }, [form]);

  useEffect(() => {
    onCategoriesChange(selectedCategories);
  }, [selectedCategories]);

  useEffect(() => {
    clearForm();
  }, [clear]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, control: keyof NoteDialogFormValue): void => {
    setForm({
      ...form,
      [control]: e.target.value
    });
  };

  const handleCategoriesChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSelectedCategories({
      ...selectedCategories,
      [e.target.value]: e.target.checked
    });
  };

  const clearForm = (): void => {
    setForm(initialForm);
  };

  // @todo change "{ (e) => handleChange(e, 'title') }" into "{ handleChange }" (use id as a control name)
  return (
    <FormWrapper>
      <InputWithLabel
        id="title"
        onChange={ (e) => handleChange(e, 'title') }
        value={ form.title }
        label={ t('TITLE') }
      />

      <InputWithLabel
        id="content"
        onChange={ (e) => handleChange(e, 'content') }
        value={ form.content }
        label={ t('CONTENT') }
        type="textarea"
      />

      <CategoriesWrapper> {/* @todo */ }
        <label>{ t('CATEGORIES') }</label>
        { categories.map((category) => (
          <label key={ category.id }>
            <input
              onChange={ handleCategoriesChange }
              type="checkbox"
              id="category"
              name={ category.id }
              value={ category.id }
              checked={ selectedCategories[category.id] }
            />
            { category.name }
          </label>
        )) }
      </CategoriesWrapper>
    </FormWrapper>
  );
};

const FormWrapper = styled.div`
  padding: 64px 0;
  flex: 1;

  > *:not(:last-child) {
    margin-bottom: 32px;
  }
`;

const CategoriesWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
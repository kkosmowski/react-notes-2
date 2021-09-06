import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { InputWithLabel } from '../InputWithLabel/InputWithLabel';
import styled from 'styled-components';
import { NoteDialogFormValue } from './note-dialog-form.interface';
import { Category } from '../domain/interfaces/category.interface';
import { EntityUid } from '../domain/types/entity-uid.type';

interface Props {
  initialForm: NoteDialogFormValue;
  categories: Category[];
  onFormChange: (form: NoteDialogFormValue) => void;
  clear: void[];
}

export const NoteDialogForm = ({ initialForm, clear, categories, onFormChange }: Props): ReactElement => {
  const [form, setForm] = useState<NoteDialogFormValue>(initialForm);
  const [selectedCategories, setSelectedCategories] = useState<Record<EntityUid, boolean>>({});

  useEffect(() => {
    onFormChange(form);
  }, [form]);

  useEffect(() => {
    clearForm();
  }, [clear]);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, control: keyof NoteDialogFormValue): void => {
    setForm({
      ...form,
      [control]: e.target.value
    });
  };

  const onCategoriesChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSelectedCategories({
      ...selectedCategories,
      [e.target.value]: e.target.checked
    });
  };

  const clearForm = (): void => {
    setForm(initialForm);
  };

  return (
    <FormWrapper>
      <InputWithLabel
        id="title"
        onChange={ (e) => onChange(e, 'title') }
        value={ form.title }
        label="Title"
      />

      <InputWithLabel
        id="content"
        onChange={ (e) => onChange(e, 'content') }
        value={ form.content }
        label="Content"
        type="textarea"
      />

      <CategoriesWrapper> {/* @todo */ }
        <label>Categories</label>
        { categories.map((category) => (
          <label key={ category.id }>
            <input
              onChange={ onCategoriesChange }
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
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
import { EntityUid } from '../domain/types/entity-uid.type';
import { FormWrapper, TitleWarning } from './NoteDialogForm.styled';
import { NoteDialogUtil } from './note-dialog.util';
import { NoteInterface } from '../domain/interfaces/note.interface';
import {
  noteDialogContentInputTestId,
  noteDialogTitleInputTestId
} from '../domain/consts/test-ids.consts';
import { Select } from '../Select/Select';
import { SelectOption } from '../Select/select-option.interface';
import { MAX_TITLE_LENGTH } from '../domain/consts/note.consts';

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
  const [titleWarning, setTitleWarning] = useState('');
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);

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

  useEffect(() => {
    setCategoryOptions(categories.map(category => ({
      label: category.name,
      value: category.id,
    })));
  }, [categories]);

  const handleChange = (e: ChangeEvent<InputOrTextarea>): void => {
    if (e.target.id === 'title' && e.target.value.length > MAX_TITLE_LENGTH) {
      setTitleWarning('MAX_TITLE_WARNING');
    } else {
      setTitleWarning('');
    }

    setForm({
      ...form,
      [e.target.id]: e.target.value.slice(0, 120),
    });
  };

  const handleCategoriesChange = (selectedIds: EntityUid[]): void => {
    setForm({
      ...form,
      categories: selectedIds,
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
      { titleWarning && <TitleWarning>{ t(titleWarning, { max: MAX_TITLE_LENGTH }) }</TitleWarning> }

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

      <Select
        label={ t('CATEGORIES') }
        placeholder={ t('COMMON:SELECT_CATEGORIES') }
        onChange={ handleCategoriesChange }
        options={ categoryOptions }
        initialValue={ form.categories }
        disabled={ !isEditModeBoth(editMode) }
        multi
      />
    </FormWrapper>
  );
};
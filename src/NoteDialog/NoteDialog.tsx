import { ReactElement, useEffect, useState } from 'react';
import { Dialog } from '../Dialog/Dialog';
import { useSelector } from 'react-redux';
import { DialogConfig } from '../domain/interfaces/dialog-config.interface';
import { DialogTitle } from '../Dialog/DialogTitle';
import { NoteDialogForm } from './NoteDialogForm';
import { NoteDialogFormValue } from '../domain/interfaces/note-dialog-form.interface';
import { v4 as uuidv4 } from 'uuid';
import { NoteInterface } from '../domain/interfaces/note.interface';
import { ConfirmationDialogData } from '../domain/interfaces/confirmation-dialog-data.interface';
import { DialogControls, DialogHeader } from '../Dialog/styles/Dialog.styles';
import { useTranslation } from 'react-i18next';
import { NoteDialogActions } from './NoteDialogActions';
import { isEditMode, NoteEditMode, toggleEditMode } from '../domain/interfaces/note-edit-mode.interface';
import { selectConfirmationResult, selectNoteDialogOpened } from '../store/selectors/ui.selectors';
import { selectOpenedNote } from '../store/selectors/note.selectors';
import { selectCategories } from '../store/selectors/category.selectors';
import NoteActions from '../store/actionCreators/note.action-creators';
import UiActions from '../store/actionCreators/ui.action-creators';

export const emptyForm: NoteDialogFormValue = {
  title: '',
  content: '',
  categories: [],
};

export const NoteDialog = (): ReactElement => {
  const { t } = useTranslation(['MAIN', 'NOTE_DIALOG', 'CONFIRMATION']);
  const config: DialogConfig = {
    width: '400px',
    flex: true
  };
  const opened = useSelector(selectNoteDialogOpened);
  const categories = useSelector(selectCategories);
  const confirmationResult = useSelector(selectConfirmationResult);
  const openedNote: NoteInterface | null = useSelector(selectOpenedNote);
  const [editMode, setEditMode] = useState<NoteEditMode>(NoteEditMode.None);
  const [dialogTitleKey, setDialogTitleKey] = useState<string>('ADD_NOTE');
  const [form, setForm] = useState<NoteDialogFormValue>(openedNote || emptyForm);
  const [clearForm, setClearForm] = useState<void[]>([]); // @todo temporary hack

  useEffect(() => {
    if (confirmationResult === true) {
      closeDialog();
    }
  }, [confirmationResult]);

  useEffect(() => {
    if (openedNote) {
      if (isEditMode(editMode)) {
        setDialogTitleKey('NOTE_DIALOG:EDIT_NOTE');
      } else {
        setDialogTitleKey('NOTE_DIALOG:VIEW_NOTE');
      }
    } else {
      setDialogTitleKey('ADD_NOTE');
    }
  }, [openedNote, editMode]);

  const handleClose = (): void => {
    if (!isFormTouched()) {
      closeDialog();
    } else {
      const data: ConfirmationDialogData = {
        title: t('CONFIRMATION:TITLE.LEAVE_PROGRESS'),
        message: t('CONFIRMATION:MESSAGE.LEAVE_PROGRESS'),
        cancelButtonText: t('CONFIRMATION:CONTROLS.NO_CANCEL'),
        confirmButtonText: t('CONFIRMATION:CONTROLS.YES_LEAVE')
      };
      UiActions.openConfirmationDialog(data);
    }
  };

  const isFormTouched = (): boolean => {
    if (!isEditMode(editMode)) {
      return false;
    }
    const initialForm = openedNote || emptyForm;
    return form.title !== initialForm.title || form.content !== initialForm.content || areCategoriesTouched(initialForm);
  };

  const areCategoriesTouched = (initialForm: NoteDialogFormValue): boolean => {
    for (const category of categories) {
      const onlyInitialFormIncludes = initialForm.categories.includes(category.id) && !form.categories.includes(category.id);
      const onlyCurrentFormIncludes = !initialForm.categories.includes(category.id) && form.categories.includes(category.id);
      if (onlyInitialFormIncludes || onlyCurrentFormIncludes) {
        return true;
      }
    }
    return false;
  };

  const closeDialog = (): void => {
    setEditMode(NoteEditMode.None);
    UiActions.closeNoteDialog();
    NoteActions.setOpenedNote(null);
  };

  const handleFormChange = (form: NoteDialogFormValue): void => {
    setForm(form);
  };

  const addNote = (): void => {
    const note: NoteInterface = {
      ...form,
      id: uuidv4(),
    };
    NoteActions.create(note);
  };

  const updateNote = (): void => {
    if (isFormTouched()) {
      NoteActions.updateNote({
        ...openedNote!,
        ...form
      });
    }
  };

  const handleSaveAndClose = (): void => {
    if (openedNote) {
      updateNote();
    } else {
      addNote();
    }
    closeDialog();
  };

  const handleAddAndNext = (): void => {
    addNote();
    setClearForm([...clearForm]);
  };

  const handleDelete = (): void => {
    // @todo add confirmation
    NoteActions.deleteNote(openedNote!.id);
    closeDialog();
  };

  const handleEditCancel = (): void => {
    setClearForm([]);
    setEditMode(NoteEditMode.None);
  };

  const handleEditReset = (): void => {
    setClearForm([]);
  };

  const handleEditModeChange = (): void => {
    if (isEditMode(editMode)) {
      updateNote();
    }
    setEditMode(toggleEditMode(editMode));
  };

  const handlePartialEditModeChange = (mode: NoteEditMode): void => {
    setEditMode(mode);
  };

  const saveAndContinueButton: ReactElement<HTMLButtonElement> = (
    <button onClick={ handleAddAndNext } className="button --contained --primary" type="button">
      { t('SAVE_AND_NEXT') }
    </button>
  );
  const deleteNoteButton: ReactElement<HTMLButtonElement> = (
    <button onClick={ handleDelete } className="button --contained --warn" type="button">
      { t('DELETE') }
    </button>
  );

  return (
    <Dialog
      onClose={ handleClose }
      opened={ opened }
      config={ config }
    >
      <DialogHeader>
        <DialogTitle>{ t(dialogTitleKey) }</DialogTitle>
        <NoteDialogActions
          openedNote={ openedNote }
          isEditMode={ isEditMode(editMode) }
          onCancel={ handleEditCancel }
          onReset={ handleEditReset }
          onEditModeChange={ handleEditModeChange }
        />
      </DialogHeader>

      <NoteDialogForm
        editMode={ editMode }
        onFormChange={ handleFormChange }
        onPartialEditModeChange={ handlePartialEditModeChange }
        initialForm={ openedNote || emptyForm }
        categories={ categories }
        clear={ clearForm }
      />

      <DialogControls>
        <div>
          <button onClick={ handleClose } className="button --regular" type="button">
            { t('CANCEL') }
          </button>
        </div>

        <div>
          { openedNote ? deleteNoteButton : saveAndContinueButton }

          <button onClick={ handleSaveAndClose } className="button --contained --primary" type="button">
            { t(isEditMode(editMode) ? 'SAVE_AND_CLOSE' : 'CLOSE') }
          </button>
        </div>
      </DialogControls>
    </Dialog>
  );
};

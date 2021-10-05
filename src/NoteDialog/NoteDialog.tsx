import { ReactElement, useEffect, useState } from 'react';
import { Dialog } from '../Dialog/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import { DialogConfig } from '../domain/interfaces/dialog-config.interface';
import { DialogTitle } from '../Dialog/DialogTitle';
import { NoteDialogForm, NoteDialogFormPayload } from './NoteDialogForm';
import { NoteDialogFormValue } from '../domain/interfaces/note-dialog-form.interface';
import { v4 as uuidv4 } from 'uuid';
import { NoteInterface } from '../domain/interfaces/note.interface';
import { ConfirmationDialogData } from '../domain/interfaces/confirmation-dialog-data.interface';
import { DialogControls, DialogHeader } from '../Dialog/styles/Dialog.styled';
import { useTranslation } from 'react-i18next';
import { NoteDialogActions } from './NoteDialogActions';
import { isEditMode, NoteEditMode, toggleEditMode } from '../domain/interfaces/note-edit-mode.interface';
import { selectConfirmationResult, selectNoteDialogOpened } from '../store/selectors/ui.selectors';
import { selectOpenedNote } from '../store/selectors/note.selectors';
import { selectUndeletedCategories } from '../store/selectors/category.selectors';
import NoteActions from '../store/actionCreators/note.action-creators';
import UiActions from '../store/actionCreators/ui.action-creators';
import { ConfirmationAction } from '../domain/enums/confirmation-action.enum';
import { Color } from '../domain/enums/color.enum';
import { Variant } from '../domain/enums/variant.enum';
import { Button } from '../Button/Button';
import { noteDialogTestId } from '../domain/consts/test-ids.consts';

export const emptyForm: NoteDialogFormValue = {
  title: '',
  content: '',
  categories: [],
};

export const NoteDialog = (): ReactElement => {
  const { t } = useTranslation(['COMMON', 'NOTE_DIALOG', 'CONFIRMATION']);
  const config: DialogConfig = {
    width: '400px',
    flex: true
  };
  const opened = useSelector(selectNoteDialogOpened);
  const categories = useSelector(selectUndeletedCategories);
  const confirmationResult = useSelector(selectConfirmationResult);
  const openedNote = useSelector(selectOpenedNote);
  const [editMode, setEditMode] = useState<NoteEditMode>(NoteEditMode.Both);
  const [dialogTitleKey, setDialogTitleKey] = useState<string>('ADD_NOTE');
  const [form, setForm] = useState<NoteDialogFormValue>(openedNote || emptyForm);
  const [valid, setValid] = useState<boolean>(false);
  const [clearForm, setClearForm] = useState<void[]>([]); // @todo temporary hack
  const dispatch = useDispatch();

  useEffect(() => {
    setEditMode(openedNote ? NoteEditMode.None : NoteEditMode.Both);
  }, [openedNote]);

  useEffect(() => {
    if (openedNote) {
      setDialogTitleKey(
        isEditMode(editMode)
          ? 'NOTE_DIALOG:EDIT_NOTE'
          : 'NOTE_DIALOG:VIEW_NOTE'
      );
    } else {
      setDialogTitleKey('ADD_NOTE');
    }
  }, [editMode]);

  useEffect(() => {
    if (confirmationResult) {
      const { action, result } = confirmationResult;
      switch (action) {
        case ConfirmationAction.LeaveNoteProgress:
          if (result) {
            closeDialog();
          }
          break;
        case ConfirmationAction.DeleteNote:
          if (result) {
            dispatch(NoteActions.deleteNote(openedNote!.id));
            closeDialog();
          }
          break;
      }
    }
  }, [confirmationResult]);

  const handleClose = (): void => {
    if (!isFormTouched()) {
      closeDialog();
    } else {
      const data: ConfirmationDialogData = {
        title: t('CONFIRMATION:TITLE.LEAVE_PROGRESS'),
        message: t('CONFIRMATION:MESSAGE.LEAVE_PROGRESS'),
        cancelButtonText: t('CONFIRMATION:CONTROLS.NO_CANCEL'),
        confirmButtonText: t('CONFIRMATION:CONTROLS.YES_LEAVE'),
        action: ConfirmationAction.LeaveNoteProgress
      };
      dispatch(UiActions.openConfirmationDialog(data));
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
    setEditMode(NoteEditMode.Both);
    dispatch(UiActions.closeNoteDialog());
    dispatch(NoteActions.setOpenedNote(null));
  };

  const handleFormChange = (payload: NoteDialogFormPayload): void => {
    setForm(payload.form);
    setValid(payload.valid);
  };

  const addNote = (): void => {
    const note: NoteInterface = {
      ...form,
      id: uuidv4(),
      deleted: false,
    };
    dispatch(NoteActions.create(note));
  };

  const updateNote = (): void => {
    if (isFormTouched() && valid) {
      dispatch(NoteActions.updateNote({
        ...openedNote!,
        ...form
      }));
    }
  };

  const handleSaveAndClose = (): void => {
    if (valid) {
      openedNote ? updateNote() : addNote();
      closeDialog();
    }
  };

  const handleAddAndNext = (): void => {
    if (valid) {
      addNote();
      setClearForm([...clearForm]);
    }
  };

  const handleDelete = (): void => {
    const data: ConfirmationDialogData = {
      title: t('CONFIRMATION:TITLE.DELETE_NOTE'),
      message: t('CONFIRMATION:MESSAGE.DELETE_NOTE'),
      cancelButtonText: t('CONFIRMATION:CONTROLS.NO_CANCEL'),
      confirmButtonText: t('CONFIRMATION:CONTROLS.YES_DELETE'),
      action: ConfirmationAction.DeleteNote
    };
    dispatch(UiActions.openConfirmationDialog(data));
  };

  const handleEditCancel = (): void => {
    setClearForm([]);
    setEditMode(NoteEditMode.None);
  };

  const handleEditReset = (): void => setClearForm([]);

  const handleEditModeChange = (): void => {
    if (isEditMode(editMode)) {
      if (valid) {
        updateNote();
        setEditMode(toggleEditMode(editMode));
      }
    } else {
      setEditMode(toggleEditMode(editMode));
    }
  };

  const handlePartialEditModeChange = (mode: NoteEditMode): void => setEditMode(mode);

  const saveAndContinueButton: ReactElement<HTMLButtonElement> = (
    <Button
      onClick={ handleAddAndNext }
      color={ Color.Primary }
      variant={ Variant.Contained }
      title={ !valid ? t('NOTE_DIALOG:INVALID_OR_EMPTY_FORM') : '' }
      disabled={ !valid }
    >
      { t('SAVE_AND_NEXT') }
    </Button>
  );

  const deleteNoteButton: ReactElement<HTMLButtonElement> = (
    <Button onClick={ handleDelete } color={ Color.Warn } variant={ Variant.Contained }>
      { t('DELETE') }
    </Button>
  );

  return (
    <Dialog
      onClose={ handleClose }
      opened={ opened }
      config={ config }
      testid={ noteDialogTestId }
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
          <Button onClick={ handleClose } variant={ Variant.Regular }>
            { t('CANCEL') }
          </Button>
        </div>

        <div>
          { openedNote ? deleteNoteButton : saveAndContinueButton }

          <Button
            onClick={ handleSaveAndClose }
            color={ Color.Primary }
            variant={ Variant.Contained }
            title={ !valid ? t('NOTE_DIALOG:INVALID_OR_EMPTY_FORM') : '' }
            disabled={ !valid }
          >
            { t(isEditMode(editMode) ? 'SAVE_AND_CLOSE' : 'CLOSE') }
          </Button>
        </div>
      </DialogControls>
    </Dialog>
  );
};

import { ReactElement, useEffect, useState } from 'react';
import { Dialog } from '../Dialog/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import { DialogConfig } from '../domain/interfaces/dialog-config.interface';
import { DialogTitle } from '../Dialog/DialogTitle';
import { NoteDialogForm, NoteDialogFormPayload } from './NoteDialogForm';
import { NoteDialogFormValue } from '../domain/interfaces/note-dialog-form.interface';
import { v4 as uuidv4 } from 'uuid';
import { NoteInterface } from '../domain/interfaces/note.interface';
import { DialogControls, DialogHeader } from '../Dialog/styles/Dialog.styled';
import { useTranslation } from 'react-i18next';
import { NoteDialogActions } from './NoteDialogActions';
import {
  isEditMode,
  NoteEditMode,
  toggleEditMode
} from '../domain/interfaces/note-edit-mode.interface';
import { selectConfirmationResult } from '../store/selectors/ui.selectors';
import { selectOpenedNote } from '../store/selectors/note.selectors';
import {
  selectCurrentCategoryId,
  selectUndeletedCategories
} from '../store/selectors/category.selectors';
import NoteActions from '../store/actionCreators/note.action-creators';
import UiActions from '../store/actionCreators/ui.action-creators';
import { ConfirmationAction } from '../domain/enums/confirmation-action.enum';
import { Color } from '../domain/enums/color.enum';
import { Variant } from '../domain/enums/variant.enum';
import { Button } from '../Button/Button';
import {
  noteDialogBackdropTestId,
  noteDialogCancelButtonTestId,
  noteDialogCloseButtonTestId,
  noteDialogDeleteButtonTestId,
  noteDialogSaveAndNextButtonTestId,
  noteDialogTestId,
  noteDialogTitleTestId
} from '../domain/consts/test-ids.consts';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { DateUtil } from '../domain/utils/date.util';
import { NoteDetails } from './NoteDialog.styled';
import { NoteSelectionMode } from '../domain/enums/note-selection-mode.enum';
import { RouterUtil } from '../domain/utils/router.util';
import { rootCategory } from '../domain/consts/root-category.const';

export const NoteDialog = (): ReactElement => {
  const { t } = useTranslation(['COMMON', 'NOTE_DIALOG']);
  const config: DialogConfig = {
    width: '400px',
    flex: true
  };
  const location = useLocation<{ previous?: string }>();
  const { noteId } = useParams<{ noteId: string }>();
  const categories = useSelector(selectUndeletedCategories);
  const confirmationResult = useSelector(selectConfirmationResult);
  const currentCategoryId = useSelector(selectCurrentCategoryId);
  const openedNote = useSelector(selectOpenedNote);
  const [editMode, setEditMode] = useState<NoteEditMode>(NoteEditMode.None);
  const [dialogTitleKey, setDialogTitleKey] = useState<string>('ADD_NOTE');
  const emptyForm: NoteDialogFormValue = {
    title: '',
    content: '',
    categories: currentCategoryId !== rootCategory.id ? [currentCategoryId] : [],
  };
  const [form, setForm] = useState<NoteDialogFormValue>(emptyForm);
  const [valid, setValid] = useState<boolean>(false);
  const [clearForm, setClearForm] = useState<void[]>([]); // @todo temporary hack
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(UiActions.openNoteDialog());
    dispatch(NoteActions.setSelectionMode(NoteSelectionMode.Single));

    return () => {
      setEditMode(NoteEditMode.Both);
      dispatch(NoteActions.clearOpenedNote());
      dispatch(UiActions.closeNoteDialog());
    };
  }, []);

  useEffect(() => {
    if (location.pathname.endsWith('/edit') && editMode === NoteEditMode.None) {
      setEditMode(NoteEditMode.Both);
    }
  }, [location]);

  useEffect(() => {
    if (openedNote) {
      setDialogTitleKey(
        isEditMode(editMode)
          ? 'NOTE_DIALOG:EDIT_NOTE'
          : 'NOTE_DIALOG:VIEW_NOTE'
      );

      dispatch(NoteActions.selectNote(noteId));

      RouterUtil.push(
        `/note/${ noteId }${ isEditMode(editMode) ? '/edit' : '' }`,
        history,
        { keepPrevious: true });
    } else if (noteId) {
      dispatch(NoteActions.findOpenedNote(noteId));
    } else {
      setEditMode(NoteEditMode.Both);
      setDialogTitleKey('ADD_NOTE');
    }
  }, [openedNote, noteId, editMode]);

  useEffect(() => {
    if (confirmationResult) {
      const { action, result } = confirmationResult;
      switch (action) {
        case ConfirmationAction.LeaveNoteProgress:
          if (result) {
            closeDialog();
            dispatch(UiActions.clearConfirmationDialogData());
          }
          break;
        case ConfirmationAction.DeleteNote:
          if (result) {
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
      dispatch(UiActions.openConfirmationDialog(ConfirmationAction.LeaveNoteProgress));
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
    RouterUtil.back(history);
  };

  const handleFormChange = (payload: NoteDialogFormPayload): void => {
    setForm(payload.form);
    setValid(payload.valid);
  };

  const addNote = (): void => {
    const note: NoteInterface = {
      ...form,
      id: uuidv4(),
      archived: false,
      deleted: false,
      createdAt: new Date().toISOString(),
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
    dispatch(UiActions.openConfirmationDialog(ConfirmationAction.DeleteNote));
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
      testid={ noteDialogSaveAndNextButtonTestId }
    >
      { t('SAVE_AND_NEXT') }
    </Button>
  );

  const deleteNoteButton: ReactElement<HTMLButtonElement> = (
    <Button
      onClick={ handleDelete }
      color={ Color.Warn }
      variant={ Variant.Contained }
      testid={ noteDialogDeleteButtonTestId }
    >
      { t('DELETE') }
    </Button>
  );

  return (
    <Dialog
      onClose={ handleClose }
      opened={ true }
      config={ config }
      testid={ noteDialogTestId }
      backdropTestid={ noteDialogBackdropTestId }
    >
      <DialogHeader>
        <DialogTitle testid={ noteDialogTitleTestId }>{ t(dialogTitleKey) }</DialogTitle>
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
        openedNote={ openedNote }
        categories={ categories }
        clear={ clearForm }
      />

      { openedNote && (
        <NoteDetails>
          <span>Created at { DateUtil.formatDate(openedNote.createdAt) }</span>
          { openedNote.updatedAt && (
            <span>Updated at { DateUtil.formatDate(openedNote.updatedAt) }</span>
          ) }
          { openedNote.archivedAt && (
            <span>Archived at { DateUtil.formatDate(openedNote.archivedAt) }</span>
          ) }
        </NoteDetails>
      ) }

      <DialogControls>
        <div>
          <Button
            onClick={ handleClose }
            variant={ Variant.Regular }
            testid={ noteDialogCancelButtonTestId }
          >
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
            testid={ noteDialogCloseButtonTestId }
          >
            { t(isEditMode(editMode) ? 'SAVE_AND_CLOSE' : 'CLOSE') }
          </Button>
        </div>
      </DialogControls>
    </Dialog>
  );
};

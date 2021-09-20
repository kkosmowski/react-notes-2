import { ReactElement, useEffect, useState } from 'react';
import { Dialog } from '../Dialog/Dialog';
import { MainState } from '../store/interfaces/main-state.interface';
import { bindActionCreators, Dispatch } from 'redux';
import * as uiActions from '../store/actions/ui.actions';
import * as noteActions from '../store/actions/note.actions';
import { connect } from 'react-redux';
import { DialogConfig } from '../domain/interfaces/dialog-config.interface';
import { DialogTitle } from '../Dialog/DialogTitle';
import { NoteDialogForm } from './NoteDialogForm';
import { NoteDialogFormValue } from '../domain/interfaces/note-dialog-form.interface';
import { v4 as uuidv4 } from 'uuid';
import { NoteInterface } from '../domain/interfaces/note.interface';
import { ConfirmationDialogData } from '../domain/interfaces/confirmation-dialog-data.interface';
import { Category } from '../domain/interfaces/category.interface';
import { DialogControls, DialogHeader } from '../Dialog/styles/Dialog.styles';
import { useTranslation } from 'react-i18next';
import { NoteDialogActions } from './NoteDialogActions';
import { isEditMode, NoteEditMode, toggleEditMode } from '../domain/interfaces/note-edit-mode.interface';

interface Props {
  opened: boolean;
  openedNote: NoteInterface | null;
  categories: Category[];
  confirmationResult: boolean | null;
  uiActions: any;
  noteActions: any;
}

export const emptyForm: NoteDialogFormValue = {
  title: '',
  content: '',
  categories: [],
};

export const NoteDialogComponent = (
  { opened, openedNote, categories, confirmationResult, uiActions, noteActions }: Props
): ReactElement => {
  const { t } = useTranslation(['MAIN', 'NOTE_DIALOG', 'CONFIRMATION']);
  const config: DialogConfig = {
    width: '400px',
    flex: true
  };
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
      uiActions.openConfirmationDialog(data);
    }
  };

  const isFormTouched = (): boolean => {
    if (!isEditMode(editMode)) {
      return false;
    }
    const initialForm = openedNote || emptyForm;
    // @todo add categories check
    return form.title !== initialForm.title || form.content !== initialForm.content;
  };

  const closeDialog = (): void => {
    setEditMode(NoteEditMode.None);
    uiActions.closeNoteDialog();
    noteActions.setOpenedNote(null);
  };

  const handleFormChange = (form: NoteDialogFormValue): void => {
    setForm(form);
  };

  const addNote = (): void => {
    const note: NoteInterface = {
      ...form,
      id: uuidv4(),
    };
    noteActions.create(note);
  };

  const updateNote = (): void => {
    if (isFormTouched()) {
      noteActions.updateNote({
        ...openedNote,
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
    noteActions.deleteNote(openedNote!.id);
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

const mapStateToProps = ({ category, note, ui }: MainState) => ({
  opened: ui.noteDialogOpened,
  openedNote: note.openedNote,
  confirmationResult: ui.confirmationDialogResult,
  categories: category.categories
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  uiActions: bindActionCreators(uiActions, dispatch),
  noteActions: bindActionCreators(noteActions, dispatch),
});

export const NoteDialog = connect(mapStateToProps, mapDispatchToProps)(NoteDialogComponent);
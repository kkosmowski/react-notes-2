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
import { DialogControls } from '../Dialog/styles/Dialog.styles';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation(['MAIN', 'CONFIRMATION']);
  const config: DialogConfig = {
    width: '400px',
    flex: true
  };
  const [form, setForm] = useState<NoteDialogFormValue>(openedNote || emptyForm);
  const [clearForm, setClearForm] = useState<void[]>([]); // @todo temporary hack

  useEffect(() => {
    if (confirmationResult === true) {
      closeDialog();
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
        confirmButtonText: t('CONFIRMATION:CONTROLS.YES_LEAVE')
      };
      uiActions.openConfirmationDialog(data);
    }
  };

  const isFormTouched = (): boolean => {
    const initialForm = openedNote || emptyForm;
    // @todo add categories check
    console.log(initialForm);
    return form.title !== initialForm.title || form.content !== initialForm.content;
  };

  const closeDialog = (): void => {
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

  const handleSaveAndClose = (): void => {
    if (openedNote) {
      noteActions.updateNote({
        ...openedNote,
        ...form
      });
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

  const saveAndContinueButton: ReactElement<HTMLButtonElement> = (
    <button onClick={ handleAddAndNext } className="button --contained --primary" type="button">
      { t('SAVE_AND_NEXT') }
    </button>
  )
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
      <DialogTitle>{ t('ADD_NOTE') }</DialogTitle>

      <NoteDialogForm
        onFormChange={ handleFormChange }
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
            { t('SAVE_AND_CLOSE') }
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
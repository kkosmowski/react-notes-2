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
import { Note } from '../domain/interfaces/note.interface';
import { ConfirmationDialogData } from '../domain/interfaces/confirmation-dialog-data.interface';
import { Category } from '../domain/interfaces/category.interface';
import { DialogControls } from '../Dialog/styles/Dialog.styles';

interface Props {
  opened: boolean;
  categories: Category[];
  confirmationResult: boolean | null;
  uiActions: any;
  noteActions: any;
}

export const emptyForm: NoteDialogFormValue = {
  title: '',
  content: '',
};

export const NoteDialogComponent = (
  { opened, categories, confirmationResult, uiActions, noteActions }: Props
): ReactElement => {
  const config: DialogConfig = {
    width: '400px',
    flex: true
  };
  const [form, setForm] = useState<NoteDialogFormValue>(emptyForm);
  const [clearForm, setClearForm] = useState<void[]>([]); // @todo temporary hack

  useEffect(() => {
    if (confirmationResult === true) {
      closeDialog();
    }
  }, [confirmationResult]);

  const handleClose = (): void => {
    if (isFormEmpty()) {
      closeDialog();
    } else {
      const data: ConfirmationDialogData = {
        title: 'Leave?',
        message: 'Are you sure you want to leave your progress?',
        cancelButtonText: 'No, cancel',
        confirmButtonText: 'Yes, leave'
      };
      uiActions.openConfirmationDialog(data);
    }
  };

  const isFormEmpty = (): boolean => {
    return form.title === emptyForm.title && form.content === emptyForm.content;
  };

  const closeDialog = (): void => {
    uiActions.closeNoteDialog();
  };

  const handleFormChange = (form: NoteDialogFormValue): void => {
    setForm(form);
  };

  const addNote = (): void => {
    const note: Note = {
      ...form,
      id: uuidv4(),
    };
    noteActions.create(note);
  };

  const handleAddAndClose = (): void => {
    addNote();
    closeDialog();
  };

  const handleAddAndNext = (): void => {
    addNote();
    setClearForm([...clearForm]);
  };

  return (
    <Dialog
      onClose={ handleClose }
      opened={ opened }
      config={ config }
    >
      <DialogTitle>Add note</DialogTitle>

      <NoteDialogForm
        onFormChange={ handleFormChange }
        initialForm={ emptyForm }
        categories={ categories }
        clear={ clearForm }
      />

      <DialogControls>
        <div>
          <button onClick={ handleClose } className="button --regular" type="button">
            Cancel
          </button>
        </div>

        <div>
          <button onClick={ handleAddAndNext } className="button --contained --primary" type="button">
            Save & next
          </button>

          <button onClick={ handleAddAndClose } className="button --contained --primary" type="button">
            Save & close
          </button>
        </div>
      </DialogControls>
    </Dialog>
  );
};

const mapStateToProps = ({ category, ui }: MainState) => ({
  opened: ui.noteDialogOpened,
  confirmationResult: ui.confirmationDialogResult,
  categories: category.categories
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  uiActions: bindActionCreators(uiActions, dispatch),
  noteActions: bindActionCreators(noteActions, dispatch),
});

export const NoteDialog = connect(mapStateToProps, mapDispatchToProps)(NoteDialogComponent);
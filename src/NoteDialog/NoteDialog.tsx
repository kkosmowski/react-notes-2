import { ReactElement, useEffect, useState } from 'react';
import { DialogControls, Dialog } from '../Dialog/Dialog';
import { MainState } from '../store/interfaces/main-state.interface';
import { bindActionCreators, Dispatch } from 'redux';
import * as uiActions from '../store/actions/ui.actions';
import * as noteActions from '../store/actions/note.actions';
import { connect } from 'react-redux';
import { DialogConfig } from '../store/interfaces/dialog-config,interface';
import { DialogTitle } from '../Dialog/DialogTitle';
import { NoteDialogForm } from './NoteDialogForm';
import { NoteDialogFormValue } from './note-dialog-form.interface';
import { Category } from '../domain/interfaces/category.interface';
import { v4 as uuidv4 } from 'uuid';
import { Note } from '../domain/interfaces/note.interface';
import { ConfirmationDialogData } from '../domain/interfaces/confirmation-dialog-data.interface';

interface Props {
  opened: boolean;
  confirmationResult: boolean | null;
  uiActions: any;
  noteActions: any;
}

const mockedCategories: Category[] = [ // @todo temp
  {
    id: uuidv4(), name: 'asd'
  },
  {
    id: uuidv4(), name: 'hehe'
  }
];

export const emptyForm: NoteDialogFormValue = {
  title: '',
  content: '',
  categories: []
};

export const NoteDialogComponent = ({ opened, confirmationResult, uiActions, noteActions }: Props): ReactElement => {
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

  const closeDialog = (): void => {
    uiActions.closeNoteDialog();
  };

  const isFormEmpty = (): boolean => {
    return form.title === emptyForm.title &&
      form.content === emptyForm.content &&
      !form.categories.length;
  };

  const handleFormChange = (form: NoteDialogFormValue): void => {
    setForm(form);
  };

  const addNote = (): void => {
    const note: Note = {
      ...form,
      id: uuidv4(),
    };
    noteActions.add(note);
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
        categories={ mockedCategories }
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

const mapStateToProps = ({ ui }: MainState) => ({
  opened: ui.noteDialogOpened,
  confirmationResult: ui.confirmationDialogResult,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  uiActions: bindActionCreators(uiActions, dispatch),
  noteActions: bindActionCreators(noteActions, dispatch),
});

export const NoteDialog = connect(mapStateToProps, mapDispatchToProps)(NoteDialogComponent);
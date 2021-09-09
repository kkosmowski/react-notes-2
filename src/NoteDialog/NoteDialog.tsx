import { ReactElement, useEffect, useState } from 'react';
import { Dialog } from '../Dialog/Dialog';
import { MainState } from '../store/interfaces/main-state.interface';
import { bindActionCreators, Dispatch } from 'redux';
import * as uiActions from '../store/actions/ui.actions';
import * as noteActions from '../store/actions/note.actions';
import * as categoryActions from '../store/actions/category.actions';
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
import { SelectedCategories } from '../domain/types/selected-categories.type';
import { EntityUid } from '../domain/types/entity-uid.type';
import { getSelectedCategoriesIds } from '../utils/get-selected-categories-ids.util';

interface Props {
  opened: boolean;
  categories: Category[];
  confirmationResult: boolean | null;
  uiActions: any;
  noteActions: any;
  categoryActions: any;
}

export const emptyForm: NoteDialogFormValue = {
  title: '',
  content: '',
};

export const NoteDialogComponent = (
  { opened, categories, confirmationResult, uiActions, noteActions, categoryActions }: Props
): ReactElement => {
  const { t } = useTranslation(['MAIN', 'CONFIRMATION']);
  const config: DialogConfig = {
    width: '400px',
    flex: true
  };
  const [form, setForm] = useState<NoteDialogFormValue>(emptyForm);
  const [selectedCategories, setSelectedCategories] = useState<SelectedCategories>({});
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
        title: t('CONFIRMATION:TITLE.LEAVE'),
        message: t('CONFIRMATION:MESSAGE.LEAVE_PROGRESS'),
        cancelButtonText: t('CONFIRMATION:CONTROLS.NO_CANCEL'),
        confirmButtonText: t('CONFIRMATION:CONTROLS.YES_LEAVE')
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

  const handleCategoriesChange = (categories: SelectedCategories): void => {
    setSelectedCategories(categories);
  };

  const addNote = (): void => {
    const note: NoteInterface = {
      ...form,
      id: uuidv4(),
    };
    noteActions
      .create(note)
      .then(() => {
        const noteCategories: EntityUid[] = getSelectedCategoriesIds(selectedCategories);
        categoryActions.addNoteToCategories(noteCategories, note.id);
      });
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
      <DialogTitle>{ t('ADD_NOTE') }</DialogTitle>

      <NoteDialogForm
        onFormChange={ handleFormChange }
        onCategoriesChange={ handleCategoriesChange }
        initialForm={ emptyForm }
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
          <button onClick={ handleAddAndNext } className="button --contained --primary" type="button">
            { t('SAVE_AND_NEXT') }
          </button>

          <button onClick={ handleAddAndClose } className="button --contained --primary" type="button">
            { t('SAVE_AND_CLOSE') }
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
  categoryActions: bindActionCreators(categoryActions, dispatch),
});

export const NoteDialog = connect(mapStateToProps, mapDispatchToProps)(NoteDialogComponent);
import { ReactElement, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { DialogConfig } from '../domain/interfaces/dialog-config.interface';
import UiActions from '../store/actionCreators/ui.action-creators';
import { Dialog } from '../Dialog/Dialog';
import { DialogTitle } from '../Dialog/DialogTitle';
import { DialogContent, DialogControls, DialogSubtitle } from '../Dialog/styles/Dialog.styled';
import { Button } from '../Button/Button';
import { Variant } from '../domain/enums/variant.enum';
import { Color } from '../domain/enums/color.enum';
import { selectSelectedNotes } from '../store/selectors/note.selectors';
import { Select } from '../Select/Select';
import { selectCategories } from '../store/selectors/category.selectors';
import { EntityUid } from '../domain/types/entity-uid.type';
import NoteActions from '../store/actionCreators/note.action-creators';

export const AddToCategoryDialog = (): ReactElement => {
  const { t } = useTranslation();
  const selectedNotes = useSelector(selectSelectedNotes);
  const categories = useSelector(selectCategories);
  const initialNoteCategories = useMemo(() => {
    return Object.values(selectedNotes).length === 1
      ? Object.values(selectedNotes)[0].categories
      : [];
  }, [selectedNotes]);
  const categoryOptions = categories.map(category => ({ label: category.name, value: category.id }));
  const [selectedCategories, setSelectedCategories] = useState<EntityUid[]>(initialNoteCategories);
  const dispatch = useDispatch();
  const dialogConfig: DialogConfig = {
    width: '400px',
    height: 'auto',
    flex: true,
  };
  const saveButtonDisabled = shallowEqual(initialNoteCategories, selectedCategories);

  const handleChange = (selected: EntityUid[]): void => {
    setSelectedCategories(selected);
  };

  const handleClose = (): void => {
    dispatch(UiActions.closeAddToCategoryDialog());
  };

  const handleSave = (): void => {
    dispatch(NoteActions.addCategories(Object.keys(selectedNotes), selectedCategories));
    handleClose();
  };

  return (
    <Dialog
      opened={ true }
      config={ dialogConfig }
      onClose={ handleClose }
    >
      <DialogTitle>{ t('ADD_TO_CATEGORY_DIALOG.TITLE') }</DialogTitle>

      <DialogContent>
        <DialogSubtitle>
          { t('ADD_TO_CATEGORY_DIALOG.CHOOSE_CATEGORIES') }
        </DialogSubtitle>

        <Select
          options={ categoryOptions }
          placeholder={ t('ADD_TO_CATEGORY_DIALOG.CHOOSE_CATEGORIES_PLACEHOLDER') }
          initialValue={ initialNoteCategories }
          onChange={ handleChange }
          multi
        />
      </DialogContent>

      <DialogControls>
        <Button onClick={ handleClose } variant={ Variant.Regular }>
          { t('COMMON.CLOSE') }
        </Button>

        <Button
          onClick={ handleSave }
          variant={ Variant.Contained }
          color={ Color.Primary }
          disabled={ saveButtonDisabled }
        >
          { t('COMMON.SAVE') }
        </Button>
      </DialogControls>
    </Dialog>
  );
};
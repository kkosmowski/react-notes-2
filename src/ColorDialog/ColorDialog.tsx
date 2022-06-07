import { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectColorDialogData } from '../store/selectors/ui.selectors';
import { DialogConfig } from '../domain/interfaces/dialog-config.interface';
import UiActions from '../store/actionCreators/ui.action-creators';
import { Dialog } from '../Dialog/Dialog';
import { DialogTitle } from '../Dialog/DialogTitle';
import { DialogContent, DialogControls, DialogSubtitle } from '../Dialog/styles/Dialog.styled';
import { Button } from '../Button/Button';
import { Variant } from '../domain/enums/variant.enum';
import { Category } from '../domain/interfaces/category.interface';
import { NoteInterface } from '../domain/interfaces/note.interface';
import { ColorPickerGrid } from '../ColorPicker/ColorPickerGrid';
import { noteBackgroundColor } from '../Note/get-notes-styles.util';
import { sidebarBackgroundColor } from '../Sidebar/styles/Sidebar.styled';
import { Color } from '../domain/enums/color.enum';
import CategoryActions from '../store/actionCreators/category.action-creators';
import NoteActions from '../store/actionCreators/note.action-creators';
import { EntityUid } from '../domain/types/entity-uid.type';
import { ColorDialogType } from '../domain/enums/color-dialog-type.enum';

export const ColorDialog = (): ReactElement => {
  const { t } = useTranslation();
  const data = useSelector(selectColorDialogData);
  const name = data!.type === 'category'
    ? (data!.data as Category).name
    : (data!.data as NoteInterface).title;
  const initialColor = (data!.data as Category | NoteInterface).color;
  const [selectedColor, setSelectedColor] = useState<string | undefined>(initialColor);
  const [subtitle, setSubtitle] = useState('');
  const dispatch = useDispatch();
  const dialogConfig: DialogConfig = {
    width: '400px',
    height: 'auto',
    flex: true,
  };

  useEffect(() => {
    if (data?.type) {
      switch (data.type) {
        case ColorDialogType.Category:
          setSubtitle('COLOR_DIALOG.SUBTITLE_FOR_CATEGORY');
          break;

        case ColorDialogType.Note:
          setSubtitle('COLOR_DIALOG.SUBTITLE_FOR_NOTE');
          break;

        case ColorDialogType.MultipleNotes:
          setSubtitle('COLOR_DIALOG.SUBTITLE_FOR_MULTIPLE_NOTES');
          break;
      }
    }
  }, [data]);

  const handleClose = (): void => {
    dispatch(UiActions.closeColorDialog());
  };

  const handleColorSelect = (color: string): void => {
    setSelectedColor(color);
  };

  const handleQuickSelect = (color: string): void => {
    handleColorSelect(color);
    handleSave();
  };

  const handleSave = (): void => {
    if (data && selectedColor) {
      switch (data.type) {
        case ColorDialogType.Category: {
          dispatch(CategoryActions.updateCategory({
            ...(data.data as Category),
            color: selectedColor,
          }));
          break;
        }

        case ColorDialogType.MultipleNotes: {
          dispatch(NoteActions.updateMultipleNotes(
            data.data as EntityUid[],
            { color: selectedColor }
          ));
          break;
        }

        case ColorDialogType.Note: {
          dispatch(NoteActions.updateNote({
            ...(data.data as NoteInterface),
            color: selectedColor,
          }));
          break;
        }
      }
    }

    handleClose();
  };

  return (
    <Dialog
      opened={ true }
      config={ dialogConfig }
      onClose={ handleClose }
    >
      <DialogTitle>{ t('COLOR_DIALOG.SELECT_COLOR') }</DialogTitle>

      <DialogContent>
        <DialogSubtitle>
          { t(subtitle, { name }) }
        </DialogSubtitle>

        <ColorPickerGrid
          onColorSelect={ handleColorSelect }
          onQuickSelect={ handleQuickSelect }
          active={ selectedColor }
          baseColor={ data!.type === 'category' ? sidebarBackgroundColor : noteBackgroundColor }
          opened
        />
      </DialogContent>

      <DialogControls>
        <Button onClick={ handleClose } variant={ Variant.Regular }>
          { t('COMMON.CLOSE') }
        </Button>

        <Button onClick={ handleSave } variant={ Variant.Contained } color={ Color.Primary }>
          { t('COMMON.SAVE') }
        </Button>
      </DialogControls>
    </Dialog>
  );
};

import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectColorDialogData } from '../store/selectors/ui.selectors';
import { DialogConfig } from '../domain/interfaces/dialog-config.interface';
import UiActions from '../store/actionCreators/ui.action-creators';
import { Dialog } from '../Dialog/Dialog';
import { DialogTitle } from '../Dialog/DialogTitle';
import { DialogControls } from '../Dialog/styles/Dialog.styled';
import { Button } from '../Button/Button';
import { Variant } from '../domain/enums/variant.enum';
import styled from 'styled-components/macro';
import { Category } from '../domain/interfaces/category.interface';
import { NoteInterface } from '../domain/interfaces/note.interface';
import { ColorPickerGrid } from '../ColorPicker/ColorPickerGrid';
import { noteBackgroundColor } from '../Note/get-notes-styles.util';
import { sidebarBackgroundColor } from '../Sidebar/styles/Sidebar.styled';
import { Color } from '../domain/enums/color.enum';
import CategoryActions from '../store/actionCreators/category.action-creators';
import NoteActions from '../store/actionCreators/note.action-creators';

export const ColorDialog = (): ReactElement => {
  const { t } = useTranslation('COLOR_DIALOG');
  const data = useSelector(selectColorDialogData);
  const name = data!.type === 'category'
    ? (data!.data as Category).name
    : (data!.data as NoteInterface).title;
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const dispatch = useDispatch();
  const dialogConfig: DialogConfig = {
    width: '400px',
    flex: true,
  };

  const handleClose = (): void => {
    dispatch(UiActions.closeColorDialog());
  };

  const handleColorSelect = (color: string): void => {
    setSelectedColor(color);
  };

  const handleSave = (): void => {
    if (data && selectedColor) {
      if (data.type === 'category') {
        dispatch(CategoryActions.updateCategory({
          ...(data.data as Category),
          color: selectedColor,
        }));
      } else {
        dispatch(NoteActions.updateNote({
          ...(data.data as NoteInterface),
          color: selectedColor,
        }));
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
      <DialogTitle>{ t('SELECT_COLOR') }</DialogTitle>

      <ColorDialogContent>
        <ColorDialogSubtitle>
          { t(data!.type === 'category' ? 'SUBTITLE_FOR_CATEGORY' : 'SUBTITLE_FOR_NOTE', { name }) }
        </ColorDialogSubtitle>

        <ColorPickerGrid
          onColorSelect={ handleColorSelect }
          active={ selectedColor }
          baseColor={ data!.type === 'category' ? sidebarBackgroundColor : noteBackgroundColor }
          opened
        />
      </ColorDialogContent>

      <DialogControls>
        <Button onClick={ handleClose } variant={ Variant.Regular }>
          { t('COMMON:CLOSE') }
        </Button>

        <Button onClick={ handleSave } variant={ Variant.Contained } color={ Color.Primary }>
          { t('COMMON:SAVE') }
        </Button>
      </DialogControls>
    </Dialog>
  );
};

const ColorDialogContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 0;
`;

const ColorDialogSubtitle = styled.p`
  margin-bottom: 16px;
  color: var(--foreground-82);
`;
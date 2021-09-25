import { ReactElement } from 'react';
import styled from 'styled-components';
import { Clear, Edit, Restore, Save } from '@material-ui/icons';
import { NoteInterface } from '../domain/interfaces/note.interface';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button/Button';
import { Color } from '../domain/enums/color.enum';
import { Variant } from '../domain/enums/variant.enum';

interface Props {
  openedNote: NoteInterface | null;
  isEditMode: boolean;
  onEditModeChange: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const NoteDialogActions = (
  { openedNote, isEditMode, onCancel, onReset, onEditModeChange }: Props
): ReactElement => {
  const { t } = useTranslation(['COMMON']);

  return (
    <StyledAside>
      { openedNote && isEditMode
        ? <>
          <Button
            onClick={ onCancel }
            color={ Color.Warn }
            variant={ Variant.Icon }
            small
            title={ t('CANCEL') }
          >
            <Clear />
          </Button>

          <Button
            onClick={ onReset }
            variant={ Variant.Icon }
            small
            title={ t('RESET') }
          >
            <Restore />
          </Button>
        </>
        : null
      }
      { openedNote
        ? <Button
          onClick={ onEditModeChange }
          variant={ Variant.Icon }
          color={ Color.Primary }
          small
          title={ t(isEditMode ? 'SAVE' : 'EDIT') }
        >
          { isEditMode ? <Save /> : <Edit /> }
        </Button>
        : null
      }
    </StyledAside>
  );
};

const StyledAside = styled.aside`
  padding-left: 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 4px;
`;
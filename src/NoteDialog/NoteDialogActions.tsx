import { ReactElement } from 'react';
import styled from 'styled-components';
import { Clear, Edit, Restore, Save } from '@material-ui/icons';
import { NoteInterface } from '../domain/interfaces/note.interface';
import { useTranslation } from 'react-i18next';

interface Props {
  openedNote: NoteInterface | null;
  isEditMode: boolean;
  onEditModeChange: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const NoteDialogActions = (
  { openedNote, isEditMode, onCancel, onReset, onEditModeChange}: Props
): ReactElement => {
  const { t } = useTranslation(['MAIN']);

  return (
    <StyledAside>
      { openedNote && isEditMode
        ? <>
          <button
            onClick={ onCancel }
            className="button --icon --small --warn"
            title={ t('CANCEL') }
          >
            <Clear />
          </button>

          <button
            onClick={ onReset }
            className="button --icon --small"
            title={ t('RESET') }
          >
            <Restore />
          </button>
        </>
        : null
      }
      { openedNote
        ? <button
          onClick={ onEditModeChange }
          className="button --icon --small --primary"
          title={ t(isEditMode ? 'SAVE' : 'EDIT') }
        >
          { isEditMode ? <Save /> : <Edit /> }
        </button>
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
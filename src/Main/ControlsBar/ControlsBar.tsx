import { MouseEvent, ReactElement } from 'react';
import styled from 'styled-components';
import UiActions from '../../store/actionCreators/ui.action-creators';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from '../../Button/Button';
import { Color } from '../../domain/enums/color.enum';
import { Variant } from '../../domain/enums/variant.enum';
import { selectNoteSelectionMode, selectSelectedNotes } from '../../store/selectors/note.selectors';
import NoteActions from '../../store/actionCreators/note.action-creators';
import { NoteSelectionMode } from '../../domain/enums/note-selection-mode.enum';

export const ControlsBar = (): ReactElement => {
  const { t } = useTranslation(['CONTROL_BAR', 'COMMON']);
  const selectedNotes = useSelector(selectSelectedNotes);
  const selectionMode = useSelector(selectNoteSelectionMode);
  const dispatch = useDispatch();

  const handleBarClick = (e: MouseEvent): void => {
    e.stopPropagation();
  };

  const handleNoteAdd = () => {
    dispatch(UiActions.openNoteDialog());
  };

  const handleSelectionModeChange = () => {
    dispatch(NoteActions.toggleSelectionMode());
  };

  const handleNoteDelete = () => {
    // @todo implement
  };

  return (
    <Bar onClick={ handleBarClick }>
      <Button
        onClick={ handleNoteAdd }
        color={ Color.Primary }
        variant={ Variant.Regular }
      >
        { t('COMMON:ADD_NOTE') }
      </Button>

      <Button
        onClick={ handleSelectionModeChange }
        color={ Color.Primary }
        variant={ Variant.Regular }
      >
        { t(
          selectionMode === NoteSelectionMode.Single
            ? 'MULTISELECT'
            : 'SINGULAR_SELECTION'
        ) }
      </Button>

      <Button
        onClick={ handleNoteDelete }
        color={ Color.Warn }
        variant={ Variant.Regular }
        disabled={ !Object.values(selectedNotes).length }
      >
        { t(Object.values(selectedNotes).length > 1
          ? 'DELETE_NOTES'
          : 'DELETE_NOTE'
        ) }
      </Button>
    </Bar>
  );
};

const Bar = styled.div`
  padding: 8px var(--wrapper-horizontal-padding);
  background-color: var(--dark200);

  > .button {
    margin-right: 8px;
  }
`;

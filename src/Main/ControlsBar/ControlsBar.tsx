import { MouseEvent, ReactElement } from 'react';
import styled from 'styled-components';
import UiActions from '../../store/actionCreators/ui.action-creators';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from '../../Button/Button';
import { Color } from '../../domain/enums/color.enum';
import { Variant } from '../../domain/enums/variant.enum';
import {
  selectNoteSelectionMode,
  selectSelectedNotes,
  selectSelectedNotesCount
} from '../../store/selectors/note.selectors';
import NoteActions from '../../store/actionCreators/note.action-creators';
import { NoteSelectionMode } from '../../domain/enums/note-selection-mode.enum';
import {
  addNoteButtonTestId,
  toggleSelectionModeButtonTestId
} from '../../domain/consts/test-ids.consts';
import { selectCurrentCategory } from '../../store/selectors/category.selectors';
import { isRootCategory } from '../../utils/is-root-category.util';

export const ControlsBar = (): ReactElement => {
  const { t } = useTranslation(['CONTROL_BAR', 'COMMON']);
  const selectedNotes = useSelector(selectSelectedNotes);
  const selectedNotesCount = useSelector(selectSelectedNotesCount);
  const selectionMode = useSelector(selectNoteSelectionMode);
  const currentCategory = useSelector(selectCurrentCategory);
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

  const handleRemoveFromCategory = () => {
    if (selectedNotesCount === 1) {
      dispatch(NoteActions.removeFromCategory({
        noteId: Object.keys(selectedNotes)[0],
        categoryId: currentCategory.id
      }));
    } else if (selectedNotesCount > 1) {
      dispatch(NoteActions.removeMultipleNotesFromCategory({
        noteIds: Object.keys(selectedNotes),
        categoryId: currentCategory.id
      }));

    }
  };

  return (
    <Bar onClick={ handleBarClick }>
      <Button
        onClick={ handleNoteAdd }
        color={ Color.Primary }
        variant={ Variant.Regular }
        testid={ addNoteButtonTestId }
      >
        { t('COMMON:ADD_NOTE') }
      </Button>

      <Button
        onClick={ handleSelectionModeChange }
        variant={ Variant.Regular }
        testid={ toggleSelectionModeButtonTestId }
      >
        { t(
          selectionMode === NoteSelectionMode.Single
            ? 'MULTISELECT'
            : 'SINGLE_SELECTION'
        ) }
      </Button>

      <Button
        onClick={ handleNoteDelete }
        color={ Color.Warn }
        variant={ Variant.Regular }
        disabled={ !selectedNotesCount }
      >
        { t(selectedNotesCount > 1
          ? 'DELETE_NOTES'
          : 'DELETE_NOTE'
        ) }
      </Button>

      { isRootCategory(currentCategory.id)
        ? null
        : <Button
          onClick={ handleRemoveFromCategory }
          variant={ Variant.Regular }
          disabled={ !selectedNotesCount }
        >
          { t('REMOVE_FROM_CATEGORY') }
        </Button>
      }
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

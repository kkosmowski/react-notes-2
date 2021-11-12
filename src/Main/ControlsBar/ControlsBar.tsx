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
import { selectCurrentCategoryId } from '../../store/selectors/category.selectors';
import { isRootCategory } from '../../utils/is-root-category.util';
import { useHistory } from 'react-router-dom';
import { selectIsMobile } from '../../store/selectors/ui.selectors';
import {
  BookmarkBorder as BookmarkBorderIcon,
  BookmarksOutlined as BookmarksOutlinedIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  DoneAll as DoneAllIcon,
  NoteAdd as NoteAddIcon,
} from '@material-ui/icons';

export const ControlsBar = (): ReactElement => {
  const { t } = useTranslation(['CONTROL_BAR', 'COMMON']);
  const selectedNotes = useSelector(selectSelectedNotes);
  const selectedNotesCount = useSelector(selectSelectedNotesCount);
  const selectionMode = useSelector(selectNoteSelectionMode);
  const currentCategoryId = useSelector(selectCurrentCategoryId);
  const isMobile = useSelector(selectIsMobile);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleBarClick = (e: MouseEvent): void => {
    e.stopPropagation();
  };

  const handleNoteAdd = () => {
    dispatch(UiActions.openNoteDialog());
    history.push({
      pathname: '/add-note',
      state: {
        previous: history.location.pathname
      }
    });
  };

  const handleSelectionModeChange = () => {
    dispatch(NoteActions.toggleSelectionMode());
  };

  const handleNoteArchive = () => {
    if (selectedNotesCount === 1) {
      dispatch(NoteActions.archiveNote(Object.keys(selectedNotes)[0]));
    } else {
      // @todo
      // dispatch(NoteActions.archiveMultipleNotes(Object.keys(selectedNotes)));
    }
  };

  const handleNoteDelete = () => {
    if (selectedNotesCount === 1) {
      dispatch(NoteActions.deleteNote(Object.keys(selectedNotes)[0]));
    } else {
      dispatch(NoteActions.deleteMultipleNotes(Object.keys(selectedNotes)));
    }
  };

  const handleRemoveFromCategory = () => {
    if (selectedNotesCount === 1) {
      dispatch(NoteActions.removeFromCategory({
        noteId: Object.keys(selectedNotes)[0],
        categoryId: currentCategoryId
      }));
    } else if (selectedNotesCount > 1) {
      dispatch(NoteActions.removeMultipleNotesFromCategory({
        noteIds: Object.keys(selectedNotes),
        categoryId: currentCategoryId
      }));
    }
  };

  return (
    <Bar onClick={ handleBarClick }>
      <Button
        onClick={ handleNoteAdd }
        color={ Color.Primary }
        variant={ isMobile ? Variant.Icon : Variant.Regular }
        lighter={ isMobile }
        testid={ addNoteButtonTestId }
      >
        { isMobile
          ? <NoteAddIcon />
          : t('COMMON:ADD_NOTE')
        }
      </Button>

      <Button
        onClick={ handleSelectionModeChange }
        variant={ isMobile ? Variant.Icon : Variant.Regular }
        lighter={ isMobile }
        testid={ toggleSelectionModeButtonTestId }
      >
        { isMobile
          ? selectionMode === NoteSelectionMode.Single ? <DoneIcon /> : <DoneAllIcon />
          : t(selectionMode === NoteSelectionMode.Single ? 'MULTISELECT' : 'SINGLE_SELECTION')
        }
      </Button>

      <Button
        onClick={ handleNoteArchive }
        variant={ isMobile ? Variant.Icon : Variant.Regular }
        disabled={ !selectedNotesCount }
        lighter={ isMobile }
      >
        { isMobile
          ? <DeleteIcon />
          : t(selectedNotesCount > 1 ? 'ARCHIVE_NOTES' : 'ARCHIVE_NOTE')
        }
      </Button>

      <Button
        onClick={ handleNoteDelete }
        color={ Color.Warn }
        variant={ isMobile ? Variant.Icon : Variant.Regular }
        disabled={ !selectedNotesCount }
        lighter={ isMobile }
      >
        { isMobile
          ? <DeleteIcon />
          : t(selectedNotesCount > 1 ? 'DELETE_NOTES' : 'DELETE_NOTE')
        }
      </Button>

      { isRootCategory(currentCategoryId)
        ? null
        : <Button
          onClick={ handleRemoveFromCategory }
          variant={ isMobile ? Variant.Icon : Variant.Regular }
          disabled={ !selectedNotesCount }
          lighter={ isMobile }
        >
          { isMobile
            ? selectedNotesCount > 1 ? <BookmarksOutlinedIcon /> : <BookmarkBorderIcon />
            : t('REMOVE_FROM_CATEGORY')
          }
        </Button>
      }
    </Bar>
  );
};

const Bar = styled.div`
  padding: 8px var(--wrapper-horizontal-padding) 0;
  background-color: var(--dark200);

  > .button {
    margin-right: 8px;
    margin-bottom: 8px;
  }
`;

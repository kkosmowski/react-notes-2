import { ChangeEvent, MouseEvent, ReactElement, useEffect } from 'react';
import UiActions from '../../store/actionCreators/ui.action-creators';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from '../../Button/Button';
import { Color } from '../../domain/enums/color.enum';
import { Variant } from '../../domain/enums/variant.enum';
import {
  selectNoteSelectionMode,
  selectSelectedNotes,
  selectSelectedNotesCount,
  selectShowArchived
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
import { selectConfirmationResult, selectIsMobile } from '../../store/selectors/ui.selectors';
import {
  AssignmentTurnedIn,
  BookmarkBorder as BookmarkBorderIcon,
  BookmarksOutlined as BookmarksOutlinedIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  DoneAll as DoneAllIcon,
  NoteAdd as NoteAddIcon,
} from '@material-ui/icons';
import { ArchivedSwitch, Bar, LeftContainer, RightContainer } from './ControlsBar.styled';
import { ConfirmationAction } from '../../domain/enums/confirmation-action.enum';

export const ControlsBar = (): ReactElement => {
  const { t } = useTranslation(['CONTROL_BAR', 'COMMON']);
  const selectedNotes = useSelector(selectSelectedNotes);
  const selectedNotesCount = useSelector(selectSelectedNotesCount);
  const selectionMode = useSelector(selectNoteSelectionMode);
  const currentCategoryId = useSelector(selectCurrentCategoryId);
  const isMobile = useSelector(selectIsMobile);
  const showArchived = useSelector(selectShowArchived);
  const confirmationResult = useSelector(selectConfirmationResult);
  const dispatch = useDispatch();
  const history = useHistory();
  const allSelectedNotesAreArchived = Object.values(selectedNotes).every((note) => note.archived);
  const noSelectedNotesAreArchived = !Object.values(selectedNotes).some((note) => note.archived);
  const archiveOrRestoreButtonEnabled = selectedNotesCount && (allSelectedNotesAreArchived || noSelectedNotesAreArchived);

  useEffect(() => {
    if (confirmationResult?.result
      && confirmationResult.action === ConfirmationAction.DeleteNote
      && selectedNotesCount > 0
    ) {
      deleteNote();
    }
  }, [confirmationResult, selectedNotesCount]);

  const handleBarClick = (e: MouseEvent): void => {
    e.stopPropagation();
  };

  const handleNoteAdd = (): void => {
    dispatch(UiActions.openNoteDialog());
    history.push({
      pathname: '/add-note',
      state: {
        previous: history.location.pathname
      }
    });
  };

  const handleSelectionModeChange = (): void => {
    dispatch(NoteActions.toggleSelectionMode());
  };

  const handleNoteArchiveOrRestore = (): void => {
    if (selectedNotesCount === 1 ) {
      const note = Object.values(selectedNotes)[0];

      if (note.archived) {
        dispatch(NoteActions.restoreNote(note));
      } else {
        dispatch(NoteActions.archiveNote(note.id));
      }
    } else {
      const notes = Object.values(selectedNotes);

      if (notes.every((note) => note.archived)) {
        dispatch(NoteActions.restoreMultipleNotes(Object.keys(selectedNotes)));
      } else if (!notes.some((note) => note.archived)) {
        dispatch(NoteActions.archiveMultipleNotes(Object.keys(selectedNotes)));
      }
    }
  };

  const handleNoteDelete = (): void => {
    dispatch(UiActions.openConfirmationDialog(ConfirmationAction.DeleteNote));
  };

  const deleteNote = (): void => {
    dispatch(UiActions.clearConfirmationDialogData());
    if (selectedNotesCount === 1) {
      dispatch(NoteActions.deleteNote(Object.keys(selectedNotes)[0]));
    } else {
      dispatch(NoteActions.deleteMultipleNotes(Object.keys(selectedNotes)));
    }
  };

  const handleRemoveFromCategory = (): void => {
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

  const handleShowArchivedChange = (e: ChangeEvent<HTMLInputElement>): void => {
    dispatch((NoteActions.setShowArchived(e.target.checked)));
  };

  return (
    <Bar onClick={ handleBarClick }>
      <LeftContainer>
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
          onClick={ handleNoteArchiveOrRestore }
          variant={ isMobile ? Variant.Icon : Variant.Regular }
          disabled={ !archiveOrRestoreButtonEnabled }
          lighter={ isMobile }
        >
          { isMobile
            ? <DeleteIcon />
            : t(selectedNotesCount > 1
              ? noSelectedNotesAreArchived ? 'ARCHIVE_NOTES' : 'RESTORE_NOTES'
              : noSelectedNotesAreArchived ? 'ARCHIVE_NOTE' : 'RESTORE_NOTE'
            )
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
      </LeftContainer>

      <RightContainer>
        <label htmlFor="showArchived">
          { isMobile
            ? <AssignmentTurnedIn />
            : t('SHOW_ARCHIVED')
          }
        </label>
        <ArchivedSwitch
          id="showArchived"
          checked={ showArchived }
          onChange={ handleShowArchivedChange }
        />
      </RightContainer>
    </Bar>
  );
};

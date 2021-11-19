import { ReactElement, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import UiActions from '../store/actionCreators/ui.action-creators';
import {
  selectConfirmationDialogOpened,
  selectNoteDialogOpened
} from '../store/selectors/ui.selectors';
import { selectOpenedNote, selectSelectedNotes } from '../store/selectors/note.selectors';
import NoteActions from '../store/actionCreators/note.action-creators';
import { ConfirmationAction } from '../domain/enums/confirmation-action.enum';
import CategoryActions from '../store/actionCreators/category.action-creators';
import { rootCategory } from '../domain/consts/root-category.const';

export const KeyboardHandler = (): ReactElement => {
  const dispatch = useDispatch();
  const history = useHistory();
  const openedNote = useSelector(selectOpenedNote);
  const openedNoteRef = useRef(openedNote);
  const noteDialogOpened = useSelector(selectNoteDialogOpened);
  const noteDialogOpenedRef = useRef(noteDialogOpened);
  const confirmationDialogOpened = useSelector(selectConfirmationDialogOpened);
  const confirmationDialogOpenedRef = useRef(confirmationDialogOpened);
  const selectedNotes = useSelector(selectSelectedNotes);
  const selectedNotesRef = useRef(selectedNotes);
  const allSelectedNotesAreArchived = useRef<boolean>();
  const noSelectedNotesAreArchived = useRef<boolean>();
  const archiveOrRestoreEnabled = useRef<boolean>();

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => { openedNoteRef.current = openedNote; }, [openedNote]);
  useEffect(() => { noteDialogOpenedRef.current = noteDialogOpened; }, [noteDialogOpened]);
  useEffect(() => { confirmationDialogOpenedRef.current = confirmationDialogOpened; }, [confirmationDialogOpened]);
  useEffect(() => {
    selectedNotesRef.current = selectedNotes;
    allSelectedNotesAreArchived.current = Object.values(selectedNotesRef.current).every((note) => note.archived);
    noSelectedNotesAreArchived.current = !Object.values(selectedNotesRef.current).some((note) => note.archived);
    archiveOrRestoreEnabled.current = !!Object.values(selectedNotesRef.current).length && (allSelectedNotesAreArchived.current || noSelectedNotesAreArchived.current);
  }, [selectedNotes]);

  const pushHistory = (pathname: string, previous = history.location.pathname): void => {
    history.push({ pathname }, { previous });
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (!isNaN(parseInt(event.key, 10))) {
      handleNumberKey(parseInt(event.key, 10));
      return;
    }

    switch (event.key) {
      case 'n':
        handleAddNote();
        break;

      case 'Escape':
        handleEscape();
        break;

      case 'o':
        handleOpenNote();
        break;

      case 'e':
        handleKeyE();
        break;

      case 'd':
      case 'Delete':
      case 'Backspace':
        handleDelete();
        break;

      case 'a':
        handleArchive();
        break;

      case 'Enter':
        handleConfirm();
        break;

      default:
        return;
    }
  };

  const handleAddNote = (): void => {
    if (!noteDialogOpenedRef.current && !confirmationDialogOpenedRef.current) {
      pushHistory('/add-note');
    }
  };

  const handleEscape = (): void => {
    if (confirmationDialogOpenedRef.current) {
      dispatch(UiActions.closeConfirmationDialog(false));
    }
    else if (noteDialogOpenedRef.current) {
      pushHistory(history.location.state?.previous || '/');
    }
  };

  const handleOpenNote = (): void => {
    if (
      !noteDialogOpenedRef.current
      && !confirmationDialogOpenedRef.current
      && Object.values(selectedNotesRef.current).length === 1
    ) {
      const noteToOpen = Object.values(selectedNotesRef.current)[0];
      dispatch(NoteActions.setOpenedNote(noteToOpen));
      pushHistory(`/note/${ noteToOpen.id }`);
    }
  };

  const handleKeyE = (): void => {
    if (confirmationDialogOpenedRef.current) {
      return;
    }

    if (
      noteDialogOpenedRef.current &&
      openedNoteRef.current &&
      !history.location.pathname.endsWith('/edit')
    ) {
      pushHistory(history.location.pathname + '/edit', history.location.state?.previous || '/' );
    }
    else if (!noteDialogOpenedRef.current && Object.values(selectedNotesRef.current).length === 1) {
      const noteToOpen = Object.values(selectedNotesRef.current)[0];
      dispatch(NoteActions.setOpenedNote(noteToOpen));
      pushHistory(`/note/${ noteToOpen.id }/edit`);
    }
  };

  const handleDelete = (): void => {
    if (Object.values(selectedNotesRef.current).length >= 1) {
      dispatch(UiActions.openConfirmationDialog(ConfirmationAction.DeleteNote));
    }
  };

  const handleArchive = (): void => {
    if (!selectedNotesRef.current) {
      return;
    }

    if (Object.keys(selectedNotesRef.current).length === 1) {
      if (Object.values(selectedNotesRef.current)[0].archived) {
        dispatch(NoteActions.restoreNote(Object.keys(selectedNotesRef.current)[0]));
      } else {
        dispatch(NoteActions.archiveNote(Object.keys(selectedNotesRef.current)[0]));
      }
    } else if (archiveOrRestoreEnabled.current) {
      if (noSelectedNotesAreArchived.current) {
        dispatch(NoteActions.archiveMultipleNotes(Object.keys(selectedNotesRef.current)));
      } else if (allSelectedNotesAreArchived.current) {
        dispatch(NoteActions.restoreMultipleNotes(Object.keys(selectedNotesRef.current)));
      }
    }
  };

  const handleConfirm = (): void => {
    if (confirmationDialogOpenedRef.current) {
      dispatch(UiActions.closeConfirmationDialog(true));
    }
  };

  const handleNumberKey = (digit: number): void => {
    if (!confirmationDialogOpenedRef.current && !noteDialogOpenedRef.current) {
      if (digit === 0) {
        dispatch(CategoryActions.change(rootCategory.id));
      } else {
        dispatch(CategoryActions.changeToIndex(digit));
      }
    }
  };

  return <></>;
};

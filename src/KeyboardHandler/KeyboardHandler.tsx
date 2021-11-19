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

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => { openedNoteRef.current = openedNote; }, [openedNote]);
  useEffect(() => { noteDialogOpenedRef.current = noteDialogOpened; }, [noteDialogOpened]);
  useEffect(() => { confirmationDialogOpenedRef.current = confirmationDialogOpened; }, [confirmationDialogOpened]);
  useEffect(() => { selectedNotesRef.current = selectedNotes; }, [selectedNotes]);

  const pushHistory = (pathname: string, previous = history.location.pathname): void => {
    history.push({ pathname }, { previous });
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
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

      case 'Enter':
        handleConfirm();
        break;
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
    if (noteDialogOpenedRef.current && openedNoteRef.current && !history.location.pathname.endsWith('/edit') ) {
      pushHistory(history.location.pathname + '/edit', history.location.state?.previous || '/' );
    }
    else if (
      !noteDialogOpenedRef.current
      && !confirmationDialogOpenedRef.current
      && Object.values(selectedNotesRef.current).length === 1
    ) {
      const noteToOpen = Object.values(selectedNotesRef.current)[0];
      dispatch(NoteActions.setOpenedNote(noteToOpen));
      pushHistory(`/note/${ noteToOpen.id }/edit`);
    }
  };

  const handleDelete = (): void => {
    if (noteDialogOpenedRef.current && openedNoteRef.current) {
      dispatch(UiActions.openConfirmationDialog(ConfirmationAction.DeleteNote));
    }
    else if (
      !noteDialogOpenedRef.current
      && !confirmationDialogOpenedRef.current
      && Object.values(selectedNotesRef.current).length === 1
    ) {
      const noteToOpen = Object.values(selectedNotesRef.current)[0];
      dispatch(NoteActions.setOpenedNote(noteToOpen));
      pushHistory(`/note/${ noteToOpen.id }/edit`);
    }
  };

  const handleConfirm = (): void => {
    if (confirmationDialogOpenedRef.current) {
      dispatch(UiActions.closeConfirmationDialog(true));
    }
  };

  return <></>;
};


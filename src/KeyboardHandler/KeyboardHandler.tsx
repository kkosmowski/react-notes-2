import { ReactElement, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import UiActions from '../store/actionCreators/ui.action-creators';
import {
  selectConfirmationDialogOpened,
  selectNoteDialogOpened,
  selectShortcutsDialogOpened
} from '../store/selectors/ui.selectors';
import { selectOpenedNote, selectSelectedNotes } from '../store/selectors/note.selectors';
import { selectSettingsOpened } from '../store/selectors/settings.selectors';
import NoteActions from '../store/actionCreators/note.action-creators';
import { ConfirmationAction } from '../domain/enums/confirmation-action.enum';
import CategoryActions from '../store/actionCreators/category.action-creators';
import { rootCategory } from '../domain/consts/root-category.const';
import { selectAddCategoryInProgress } from '../store/selectors/category.selectors';
import { RouterUtil } from '../domain/utils/router.util';

type ObservedDialogs = 'noteDialog' | 'confirmationDialog' | 'shortcutsDialog' | 'settings';

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
  const shortcutsDialogOpened = useSelector(selectShortcutsDialogOpened);
  const shortcutsDialogOpenedRef = useRef(shortcutsDialogOpened);
  const settingsOpened = useSelector(selectSettingsOpened);
  const settingsOpenedRef = useRef(settingsOpened);
  const addCategoryInProgress = useSelector(selectAddCategoryInProgress);
  const addCategoryInProgressRef = useRef(addCategoryInProgress);
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
  useEffect(() => { shortcutsDialogOpenedRef.current = shortcutsDialogOpened; }, [shortcutsDialogOpened]);
  useEffect(() => { settingsOpenedRef.current = settingsOpened; }, [settingsOpened]);
  useEffect(() => { addCategoryInProgressRef.current = addCategoryInProgress; }, [addCategoryInProgress]);

  const anyDialogOrSettingsOpened = (except?: ObservedDialogs[]): boolean => (
    noteDialogOpenedRef.current && !except?.includes('noteDialog') ||
    confirmationDialogOpenedRef.current && !except?.includes('confirmationDialog') ||
    shortcutsDialogOpenedRef.current && !except?.includes('shortcutsDialog') ||
    settingsOpenedRef.current && !except?.includes('settings')
  );

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

      case 'c':
        handleCreateCategory();
        break;

      case 's':
        handleOpenSettings();
        break;

      case '/':
        handleOpenShortcutsDialog();
        break;

      default:
        return;
    }
  };

  const handleAddNote = (): void => {
    if (anyDialogOrSettingsOpened()) {
      return;
    }

    RouterUtil.push('/add-note', history);
  };

  const handleEscape = (): void => {
    if (confirmationDialogOpenedRef.current) {
      dispatch(UiActions.closeConfirmationDialog(false));
    } else if (anyDialogOrSettingsOpened(['confirmationDialog'])) {
      RouterUtil.back(history, { keepPrevious: true });
    } else if (addCategoryInProgressRef.current) {
      dispatch(CategoryActions.deleteTemporary(true));
    }
  };

  const handleOpenNote = (): void => {
    if (
      !anyDialogOrSettingsOpened() &&
      Object.values(selectedNotesRef.current).length === 1
    ) {
      const noteToOpen = Object.values(selectedNotesRef.current)[0];
      dispatch(NoteActions.setOpenedNote(noteToOpen));
      RouterUtil.push(`/note/${ noteToOpen.id }`, history);
    }
  };

  const handleKeyE = (): void => {
    if (anyDialogOrSettingsOpened(['noteDialog'])) {
      return;
    }

    if (
      noteDialogOpenedRef.current &&
      openedNoteRef.current &&
      !history.location.pathname.endsWith('/edit')
    ) {
      RouterUtil.push(history.location.pathname + '/edit', history, { keepPrevious: true });
    } else if (!noteDialogOpenedRef.current && Object.values(selectedNotesRef.current).length === 1) {
      const noteToOpen = Object.values(selectedNotesRef.current)[0];
      dispatch(NoteActions.setOpenedNote(noteToOpen));
      RouterUtil.push(`/note/${ noteToOpen.id }/edit`, history);
    }
  };

  const handleDelete = (): void => {
    if (anyDialogOrSettingsOpened(['noteDialog'])) {
      return;
    }

    if (!noteDialogOpenedRef.current || (noteDialogOpenedRef.current && openedNoteRef.current)) {
      if (Object.values(selectedNotesRef.current).length >= 1) {
        dispatch(UiActions.openConfirmationDialog(ConfirmationAction.DeleteNote));
      }
    }
  };

  const handleArchive = (): void => {
    if (!selectedNotesRef.current || anyDialogOrSettingsOpened()) {
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
    if (anyDialogOrSettingsOpened()) {
      return;
    }

    if (digit === 0) {
      dispatch(CategoryActions.change(rootCategory.id));
    } else {
      dispatch(CategoryActions.changeToIndex(digit));
    }
  };

  const handleCreateCategory = (): void => {
    if (anyDialogOrSettingsOpened() || addCategoryInProgressRef.current) {
      return;
    }

    dispatch(CategoryActions.addCategory());
  };

  const handleOpenSettings = (): void => {
    if (anyDialogOrSettingsOpened()) {
      return;
    }

    RouterUtil.push('/settings', history);
  };

  const handleOpenShortcutsDialog = (): void => {
    if (anyDialogOrSettingsOpened()) {
      return;
    }

    RouterUtil.push('/shortcuts', history);
  };

  return <></>;
};


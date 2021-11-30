import { MouseEvent, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { NoteInterface } from '../domain/interfaces/note.interface';
import { Note } from '../Note/Note';
import { COLUMN_MIN_WIDTH_PX, MAX_CLICK_DURATION_MS } from '../domain/consts/note-container.consts';
import { debounce } from '@material-ui/core';
import { rootCategory } from '../domain/consts/root-category.const';
import { useTranslation } from 'react-i18next';
import { Loader } from '../Loader/Loader';
import { LoaderCentered } from '../domain/enums/loader-centered.enum';
import { LoaderSize } from '../domain/enums/loader-size.enum';
import { EntityUid } from '../domain/types/entity-uid.type';
import { NoteSelectionMode } from '../domain/enums/note-selection-mode.enum';
import { NoNotesText, NotesWrapper, NotesWrapperContainer } from './NotesContainer.styled';
import NoteActions from '../store/actionCreators/note.action-creators';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAreAllSelectedNotesArchived,
  selectAreAllSelectedNotesNotArchived,
  selectNotes,
  selectNoteSelectionMode,
  selectNotesLoading,
  selectNoteToOpen,
  selectOpenedNote,
  selectSelectedNotes,
  selectSelectedNotesCount,
} from '../store/selectors/note.selectors';
import { selectCurrentCategoryId } from '../store/selectors/category.selectors';
import { noNotesTextTestId } from '../domain/consts/test-ids.consts';
import { useHistory, useParams } from 'react-router-dom';
import CategoryActions from '../store/actionCreators/category.action-creators';
import { RenderedNote } from '../domain/interfaces/rendered-note.interface';
import { Selection } from './Selection';
import { MouseAction, MouseActionPayload } from '../domain/interfaces/mouse-action.interface';
import { ConfirmationAction } from '../domain/enums/confirmation-action.enum';
import { selectConfirmationResult, selectIsMobile } from '../store/selectors/ui.selectors';
import UiActions from '../store/actionCreators/ui.action-creators';
import { RouterUtil } from '../domain/utils/router.util';
import { ColorDialogType } from '../domain/enums/color-dialog-type.enum';

export const NotesContainer = (): ReactElement => {
  const { categoryId } = useParams<{ categoryId: EntityUid | undefined }>();
  const { t } = useTranslation('COMMON');
  const notes: NoteInterface[] = useSelector(selectNotes);
  const notesLoading: boolean = useSelector(selectNotesLoading);
  const currentCategoryId = useSelector(selectCurrentCategoryId);
  const selectionMode: NoteSelectionMode = useSelector(selectNoteSelectionMode);
  const selectedNotes = useSelector(selectSelectedNotes);
  const selectedNotesCount = useSelector(selectSelectedNotesCount);
  const confirmationResult = useSelector(selectConfirmationResult);
  const openedNote = useSelector(selectOpenedNote);
  const noteToOpen = useSelector(selectNoteToOpen);
  const isMobile = useSelector(selectIsMobile);
  const [currentCategoryNotes, setCurrentCategoryNotes] = useState<NoteInterface[]>([]);
  const [selectionCoveredNotes, setSelectionCoveredNotes] = useState<EntityUid[]>([]);
  const [notesToRender, setNotesToRender] = useState<ReactElement[]>([]);
  const [renderedNotes, setRenderedNotes] = useState<RenderedNote[]>([]);
  const [mouseAction, setMouseAction] = useState<MouseActionPayload | null>(null);
  const mouseDownAt = useRef<Date | null>(null);
  const clickDuration = useRef<number | null>(null);
  const [numberOfColumns, setNumberOfColumns] = useState<number>(1);
  const isMouseDown = useRef<boolean>(false);
  const containerRef = useRef<HTMLElement | null>(null);
  const noNotesText: ReactElement = <NoNotesText data-testid={ noNotesTextTestId }>{ t('NO_NOTES') }</NoNotesText>;
  const shiftPressed = useRef<boolean>(false);
  const allSelectedNotesAreArchived = useSelector(selectAreAllSelectedNotesArchived);
  const noSelectedNotesAreArchived = useSelector(selectAreAllSelectedNotesNotArchived);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(NoteActions.get());
    document.addEventListener('keydown', setShiftDown);
    document.addEventListener('keyup', setShiftUp);

    return () => {
      window.removeEventListener('resize', debounce(calculateNumberOfColumns, 100));
      document.removeEventListener('keydown', setShiftDown);
      document.removeEventListener('keyup', setShiftUp);
    };
  }, []);

  useEffect(() => {
    if (confirmationResult?.result
      && confirmationResult.action === ConfirmationAction.DeleteNote
      && selectedNotesCount > 0
    ) {
      deleteNote();
    }
  }, [confirmationResult, selectedNotesCount]);

  useEffect(() => {
    if (categoryId) {
      if (categoryId !== currentCategoryId) {
        dispatch(CategoryActions.change(categoryId, true));
      }
    } else {
      const path = history.location.pathname;

      if (!(path.endsWith('/shortcuts') || path.includes('note'))) {
        dispatch(CategoryActions.change(rootCategory.id, true));
      }
    }
  }, [categoryId]);

  useEffect(() => {
    if (notes.length) {
      calculateNumberOfColumns();
      initResizeListener();

      if (noteToOpen && !openedNote) {
        const note: NoteInterface | undefined = notes.find((note) => note.id === noteToOpen);
        note && dispatch(NoteActions.setOpenedNote(note));
      }
    }
  }, [dispatch, notes, noteToOpen]);

  useEffect(() => {
    if (currentCategoryId === rootCategory.id) {
      setCurrentCategoryNotes(notes);
    } else if (currentCategoryId) {
      const filteredNotes = notes.filter((note) => note.categories.includes(currentCategoryId));
      setCurrentCategoryNotes((filteredNotes));
    }
  }, [notes, currentCategoryId]);

  useEffect(() => {
    if (selectedNotes && selectionMode) {
      const _notes: ReactElement[] = currentCategoryNotes
        .map((note) => (
          <Note
            onSelect={ handleNoteSelect }
            onOpen={ handleNoteOpen }
            onArchive={ handleArchive }
            onDelete={ handleDelete }
            onColorChange={ handleColorChange }
            onAddToCategory={ handleAddToCategory }
            data={ note }
            isSelected={ !!selectedNotes[note.id] }
            isSelectionCovered={ selectionCoveredNotes.includes(note.id) }
            selectionMode={ selectionMode }
            key={ note.id }
          />
        ));
      setNotesToRender(_notes);
    }
  }, [currentCategoryNotes, selectedNotes, selectionCoveredNotes, selectionMode]);

  useEffect(() => {
    if (notes.length && notesToRender.length) {
      const rendered: RenderedNote[] = [];

      Array.from(document.getElementsByClassName('note')).forEach((note: Element, index) => {
        if (currentCategoryNotes[index]) {
          const { top, left, width, height } = note.getBoundingClientRect();
          rendered.push({ top, left, width, height, id: currentCategoryNotes[index].id });
        }
      });

      setRenderedNotes(rendered);
    }
  }, [notes, notesToRender]);

  const deleteNote = (): void => {
    dispatch(UiActions.clearConfirmationDialogData());
    if (selectedNotesCount === 1) {
      dispatch(NoteActions.deleteNote(Object.keys(selectedNotes)[0]));
    } else {
      dispatch(NoteActions.deleteMultipleNotes(Object.keys(selectedNotes)));
    }
  };

  const setShiftDown = (event: KeyboardEvent): void  => {
    event.key === 'Shift' && (shiftPressed.current = true);
  };

  const setShiftUp = (event: KeyboardEvent): void  => {
    event.key === 'Shift' && (shiftPressed.current = false);
  };

  const handleMouseUp = (event: MouseEvent<HTMLDivElement>): void => {
    if (!isMobile && mouseDownAt.current && event.button === 0) {
      clickDuration.current = new Date().getTime() - mouseDownAt.current.getTime();
      mouseDownAt.current = null;
      setMouseAction({ action: MouseAction.Up, event });
    }
    isMouseDown.current = false;
  };
  const handleMouseMove = (event: MouseEvent<HTMLDivElement>): void => {
    if (!isMobile) {
      setMouseAction({ action: MouseAction.Move, event });
    }
  };

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>): void => {
    if (!isMobile && event.button === 0) { // LMB only
      clickDuration.current = null;
      mouseDownAt.current = new Date();
      setMouseAction({ action: MouseAction.Down, event });
      isMouseDown.current = true;
    }
  };

  const handleSelectionCoverageChange = (noteIds: EntityUid[]) => {
    setSelectionCoveredNotes(noteIds);
  };

  const initResizeListener = (): void => {
    window.addEventListener('resize', debounce(calculateNumberOfColumns, 100));
  };

  const wasAClick = (): boolean => clickDuration.current !== null && clickDuration.current <= MAX_CLICK_DURATION_MS;

  const calculateNumberOfColumns = useCallback((): void => {
    if (!containerRef.current) return;

    const containerWidth: number = containerRef.current.clientWidth;
    const theoreticalNumberOfColumns: number = Math.floor(containerWidth / COLUMN_MIN_WIDTH_PX) || 1;

    setNumberOfColumns(Math.min(theoreticalNumberOfColumns, notes.length));
  }, [setNumberOfColumns, containerRef, notes, COLUMN_MIN_WIDTH_PX]);

  const handleNoteSelect = (noteId: EntityUid): void => {
    if (selectedNotesCount === 1 && shiftPressed.current) {
      dispatch(NoteActions.toggleSelectionMode());
    }

    if (!selectedNotes[noteId]) {
      dispatch(NoteActions.selectNote(noteId));
    } else if (selectionMode === NoteSelectionMode.Multi && wasAClick()) {
      dispatch(NoteActions.deselectNote(noteId));
    }
  };

  const handleNoteOpen = (noteToOpen: NoteInterface, openWithEdit = false): void => {
    dispatch(NoteActions.setOpenedNote(noteToOpen));
    RouterUtil.push(
      `/note/${ noteToOpen.id }${ openWithEdit ? '/edit' : '' }`,
      history,
      { dontCompareWithPrevious: true }
    );
  };

  const handleArchive = (note: NoteInterface): void => {
    if (selectedNotesCount > 1) {
      if (allSelectedNotesAreArchived) {
        dispatch(NoteActions.restoreMultipleNotes(Object.keys(selectedNotes)));
      } else if (noSelectedNotesAreArchived) {
        dispatch(NoteActions.archiveMultipleNotes(Object.keys(selectedNotes)));
      }
    } else {
      dispatch(note.archived ? NoteActions.restoreNote(note.id) : NoteActions.archiveNote(note.id));
    }
  };

  const handleDelete = (): void => {
    dispatch(UiActions.openConfirmationDialog(ConfirmationAction.DeleteNote));
  };

  const handleColorChange = (note: NoteInterface): void => {
    if (selectedNotesCount > 1) {
      dispatch(UiActions.openColorDialog(ColorDialogType.MultipleNotes, Object.keys(selectedNotes)));
    } else {
      dispatch(UiActions.openColorDialog(ColorDialogType.Note, note));
    }
  };

  const handleAddToCategory = (): void => {
    dispatch(UiActions.openAddToCategoryDialog());
  };

  return (
    <NotesWrapper
      onMouseDown={ handleMouseDown }
      onMouseMove={ handleMouseMove }
      onMouseUp={ handleMouseUp }
    >
      { !isMobile && (
        <Selection
          renderedNotes={ renderedNotes }
          mouseAction={ mouseAction }
          selectionCoveredNotes={ selectionCoveredNotes }
          onSelectionCoverageChange={ handleSelectionCoverageChange }
        />
      ) }
      <NotesWrapperContainer ref={ containerRef } columns={ numberOfColumns }>
        { notesLoading
          ? <Loader absolute={ true } centered={ LoaderCentered.Horizontally } size={ LoaderSize.Medium } />
          : notesToRender.length ? notesToRender : noNotesText
        }
      </NotesWrapperContainer>
    </NotesWrapper>
  );
};

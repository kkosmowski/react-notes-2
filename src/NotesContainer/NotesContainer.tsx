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
import { selectConfirmationResult } from '../store/selectors/ui.selectors';
import UiActions from '../store/actionCreators/ui.action-creators';

export const NotesContainer = (): ReactElement => {
  const { categoryId } = useParams<{ categoryId: EntityUid | undefined }>();
  const { t } = useTranslation('COMMON');
  const notes: NoteInterface[] = useSelector(selectNotes);
  const notesLoading: boolean = useSelector(selectNotesLoading);
  const currentCategoryId: EntityUid = useSelector(selectCurrentCategoryId);
  const selectionMode: NoteSelectionMode = useSelector(selectNoteSelectionMode);
  const selectedNotes = useSelector(selectSelectedNotes);
  const selectedNotesCount = useSelector(selectSelectedNotesCount);
  const confirmationResult = useSelector(selectConfirmationResult);
  const openedNote = useSelector(selectOpenedNote);
  const noteToOpen = useSelector(selectNoteToOpen);
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
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(NoteActions.get());

    return () => {
      window.removeEventListener('resize', debounce(calculateNumberOfColumns, 100));
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
    if (categoryId && categoryId !== currentCategoryId) {
      dispatch(CategoryActions.change(categoryId, true));
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
    } else {
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
        if (notes[index]) {
          const { top, left, width, height } = note.getBoundingClientRect();
          rendered.push({ top, left, width, height, id: notes[index].id });
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

  const handleMouseUp = (event: MouseEvent<HTMLDivElement>): void => {
    if (mouseDownAt.current) {
      clickDuration.current = new Date().getTime() - mouseDownAt.current.getTime();
      mouseDownAt.current = null;
      setMouseAction({ action: MouseAction.Up, event });
    }
    isMouseDown.current = false;
  };
  const handleMouseMove = (event: MouseEvent<HTMLDivElement>): void => {
    setMouseAction({ action: MouseAction.Move, event });
  };
  const handleMouseDown = (event: MouseEvent<HTMLDivElement>): void => {
    clickDuration.current = null;
    mouseDownAt.current = new Date();
    setMouseAction({ action: MouseAction.Down, event });
    isMouseDown.current = true;
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
    if (!selectedNotes[noteId]) {
      dispatch(NoteActions.selectNote(noteId));
    } else if (selectionMode === NoteSelectionMode.Multi && wasAClick()) {
      dispatch(NoteActions.deselectNote(noteId));
    }
  };

  const handleNoteOpen = (noteToOpen: NoteInterface, openWithEdit = false): void => {
    dispatch(NoteActions.setOpenedNote(noteToOpen));
    history.push(
      { pathname: `/note/${ noteToOpen.id }${ openWithEdit ? '/edit' : '' }` },
      { previous: history.location.pathname }
    );
  };

  const handleArchive = (note: NoteInterface): void => {
    dispatch(note.archived ? NoteActions.restoreNote(note.id) : NoteActions.archiveNote(note.id));
  };

  const handleDelete = (noteId: EntityUid): void => {
    dispatch(NoteActions.deleteNote(noteId));
  };

  return (
    <NotesWrapper
      onMouseDown={ handleMouseDown }
      onMouseMove={ handleMouseMove }
      onMouseUp={ handleMouseUp }
    >
      <Selection
        renderedNotes={ renderedNotes }
        mouseAction={ mouseAction }
        selectionCoveredNotes={ selectionCoveredNotes }
        onSelectionCoverageChange={ handleSelectionCoverageChange }
      />
      <NotesWrapperContainer ref={ containerRef } columns={ numberOfColumns }>
        { notesLoading
          ? <Loader absolute={ true } centered={ LoaderCentered.Horizontally } size={ LoaderSize.Medium } />
          : notesToRender.length ? notesToRender : noNotesText
        }
      </NotesWrapperContainer>
    </NotesWrapper>
  );
};

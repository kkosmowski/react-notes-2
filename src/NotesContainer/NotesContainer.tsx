import {
  CSSProperties, MouseEvent, ReactElement, useCallback, useEffect, useLayoutEffect, useRef, useState
} from 'react';
import { NoteInterface } from '../domain/interfaces/note.interface';
import { Note } from '../Note/Note';
import { COLUMN_MIN_WIDTH_PX, MIN_SELECTION_SIZE_PX } from '../domain/consts/note-container.consts';
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
} from '../store/selectors/note.selectors';
import { selectCurrentCategoryId } from '../store/selectors/category.selectors';
import { noNotesTextTestId } from '../domain/consts/test-ids.consts';
import { useHistory, useParams } from 'react-router-dom';
import CategoryActions from '../store/actionCreators/category.action-creators';
import styled from 'styled-components/macro';

const initialSelection: SelectionValues = { left: -999, top: 0, width: 0, height: 0, startX: 0, startY: 0 };

export const NotesContainer = (): ReactElement => {
  const { categoryId } = useParams<{ categoryId: EntityUid | undefined }>();
  const { t } = useTranslation('COMMON');
  const notes: NoteInterface[] = useSelector(selectNotes);
  const notesLoading: boolean = useSelector(selectNotesLoading);
  const currentCategoryId: EntityUid = useSelector(selectCurrentCategoryId);
  const noteSelectionMode: NoteSelectionMode = useSelector(selectNoteSelectionMode);
  const selectedNotes = useSelector(selectSelectedNotes);
  const openedNote = useSelector(selectOpenedNote);
  const noteToOpen = useSelector(selectNoteToOpen);
  const [currentCategoryNotes, setCurrentCategoryNotes] = useState<NoteInterface[]>([]);
  const [notesToRender, setNotesToRender] = useState<ReactElement[]>([]);
  const [renderedNotes, setRenderedNotes] = useState<RenderedNote[]>([]);
  const [numberOfColumns, setNumberOfColumns] = useState<number>(1);
  const [style, setStyle] = useState<CSSProperties>({});
  const [selection, setSelection] = useState<SelectionValues>(initialSelection);
  const isMouseDown = useRef<boolean>(false);
  const containerRef = useRef<HTMLElement | null>(null);
  const selectionCoveredNotes = useRef<EntityUid[]>([]);
  const noNotesText: ReactElement = <NoNotesText data-testid={ noNotesTextTestId }>{ t('NO_NOTES') }</NoNotesText>;
  const dispatch = useDispatch();
  const history = useHistory();
  const selectionThreshold = 0.5;

  useEffect(() => {
    setTimeout(() => {
      if (notesToRender) {
        const rendered: RenderedNote[] = [];

        Array.from(document.getElementsByClassName('note')).forEach((note: Element, index) => {
          const { top, left, width, height } = note.getBoundingClientRect();
          rendered.push({ top, left, width, height, id: notes[index].id });
        });

        setRenderedNotes(rendered);
      }
    });
  }, [notesToRender]);

  useEffect(() => {
    const { left, top, width, height } = selection;
    const isSelectionHidden = left === -999;
    const isSelectionSizeAcceptable = width > MIN_SELECTION_SIZE_PX && height > MIN_SELECTION_SIZE_PX;

    if (isSelectionHidden || isSelectionSizeAcceptable) {
      setStyle({
        left: left + 'px',
        top: top + 'px',
        width: width + 'px',
        height: height + 'px',
      });
    }

    if (isSelectionSizeAcceptable) {
      checkIfContainsNotes();
    }
  }, [selection, setStyle]);

  const checkIfContainsNotes = () => {
    const getCoords = (uiCoords: UICoords) => [
      {
        y: uiCoords.top,
        x: uiCoords.left,
      },
      {
        y: uiCoords.top + uiCoords.height,
        x: uiCoords.left + uiCoords.width,
      },
    ];
    const [selectionStart, selectionEnd] = getCoords(selection);

    selectionCoveredNotes.current = renderedNotes
      .filter((note) => {
        const [noteStart, noteEnd] = getCoords(note);
        const selectionEndsBeforeNote = selectionEnd.x <= noteStart.x || selectionEnd.y <= noteStart.y;
        const selectionStartsAfterNote = selectionStart.x >= noteEnd.x || selectionStart.y >= noteEnd.y;

        if (selectionEndsBeforeNote || selectionStartsAfterNote) {
          return false;
        }

        const [, intersectionX1, intersectionX2] = [selectionStart.x, selectionEnd.x, noteStart.x, noteEnd.x].sort((a,b) => a > b ? 1 : -1);
        const [, intersectionY1, intersectionY2] = [selectionStart.y, selectionEnd.y, noteStart.y, noteEnd.y].sort((a,b) => a > b ? 1 : -1);

        const noteArea = note.width * note.height;
        const intersectedArea = (intersectionX2 - intersectionX1) * (intersectionY2 - intersectionY1);
        return intersectedArea / noteArea > selectionThreshold;
      })
      .map(note => note.id);
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>): void => {
    isMouseDown.current = true;

    setSelection({
      startX: e.clientX,
      startY: e.clientY,
      left: e.clientX,
      top: e.clientY,
      width: 0,
      height: 0,
    });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>): void => {
    if (isMouseDown.current) {
      setSelection({
        ...selection,
        ...(e.clientX - selection.startX >= 0
          ? { width: e.clientX - selection.left }
          : {
            width: Math.abs(e.clientX - selection.startX),
            left: e.clientX,
          }
        ),
        ...(e.clientY - selection.startY >= 0
          ? { height: e.clientY - selection.top }
          : {
            height: Math.abs(e.clientY - selection.startY),
            top: e.clientY,
          }
        ),
      });
    }
  };

  const handleMouseUp = (): void => {
    isMouseDown.current = false;
    if (selectionCoveredNotes.current.length) {
      dispatch(NoteActions.selectMultipleNotes(selectionCoveredNotes.current));
    }
    setSelection(initialSelection);
  };

  useEffect(() => {
    dispatch(NoteActions.get());

    return () => {
      window.removeEventListener('resize', debounce(calculateNumberOfColumns, 100));
    };
  }, []);

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
    const _notes: ReactElement[] = currentCategoryNotes
      .map((note) => (
        <Note
          onSelect={ handleNoteSelect }
          onOpen={ handleNoteOpen }
          onArchive={ handleArchive }
          onDelete={ handleDelete }
          data={ note }
          isSelected={ !!selectedNotes[note.id] }
          isSelectionCovered={ selectionCoveredNotes.current.includes(note.id) }
          selectionMode={ noteSelectionMode }
          key={ note.id }
        />
      ));
    setNotesToRender(_notes);
  }, [currentCategoryNotes, selectedNotes, selection, selectionCoveredNotes, noteSelectionMode]);

  const initResizeListener = (): void => {
    window.addEventListener('resize', debounce(calculateNumberOfColumns, 100));
  };

  const calculateNumberOfColumns = useCallback((): void => {
    const containerWidth: number = containerRef.current!.clientWidth;
    const theoreticalNumberOfColumns: number = Math.floor(containerWidth / COLUMN_MIN_WIDTH_PX) || 1;
    setNumberOfColumns(Math.min(theoreticalNumberOfColumns, notes.length));
  }, [setNumberOfColumns, containerRef, notes, COLUMN_MIN_WIDTH_PX]);

  const handleNoteSelect = (noteId: EntityUid): void => {
    if (!selectedNotes[noteId]) {
      dispatch(NoteActions.selectNote(noteId));
    } else if (noteSelectionMode === NoteSelectionMode.Multi) {
      dispatch(NoteActions.deselectNote(noteId));
    }
  };

  const handleNoteOpen = (noteToOpen: NoteInterface, openWithEdit = false): void => {
    dispatch(NoteActions.setOpenedNote(noteToOpen));
    history.push({
      pathname: `/note/${ noteToOpen.id }${ openWithEdit ? '/edit' : '' }`,
      state: {
        previous: history.location.pathname
      }
    });
  };

  const handleArchive = (note: NoteInterface): void => {
    dispatch(note.archived ? NoteActions.restoreNote(note) : NoteActions.archiveNote(note.id));
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
      <Selection style={ style } />
      <NotesWrapperContainer ref={ containerRef } columns={ numberOfColumns }>
        { notesLoading
          ? <Loader absolute={ true } centered={ LoaderCentered.Horizontally } size={ LoaderSize.Medium } />
          : notesToRender.length
            ? notesToRender
            : noNotesText
        }
      </NotesWrapperContainer>
    </NotesWrapper>
  );
};

interface UICoords {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface SelectionValues extends UICoords {
  startX: number;
  startY: number;
}

const Selection = styled.div`
  position: absolute;
  z-index: 1;
  background: var(--primary200-60);
  border: 1px solid var(--primary100);
  opacity: 0.3;
`;

interface RenderedNote extends UICoords {
  id: EntityUid;
}
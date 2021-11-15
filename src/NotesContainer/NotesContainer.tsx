import {
  CSSProperties, MouseEvent, ReactElement, useCallback, useEffect, useLayoutEffect, useRef, useState
} from 'react';
import { NoteInterface } from '../domain/interfaces/note.interface';
import { Note } from '../Note/Note';
import { COLUMN_MIN_WIDTH_PX } from '../domain/consts/note-container.consts';
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
import { Coords } from '../domain/interfaces/coords.interface';

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
  const [selection, setSelection] = useState<SelectionValues>({ left: 0, top: 0, width: 0, height: 0});
  const isMouseDown = useRef<boolean>(false);
  const containerRef = useRef<HTMLElement | null>(null);
  const containerOffset = useRef<{ top: number; left: number }>({ top: 0, left: 0 });
  const selectionCoveredNotes = useRef<EntityUid[]>([]);
  const noNotesText: ReactElement = <NoNotesText data-testid={ noNotesTextTestId }>{ t('NO_NOTES') }</NoNotesText>;
  const dispatch = useDispatch();
  const history = useHistory();

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
    setStyle({
      left: selection.left + 'px',
      top: selection.top + 'px',
      width: selection.width + 'px',
      height: selection.height + 'px',
    });
    checkIfContainsNotes();
  }, [selection]);

  const checkIfContainsNotes = () => {
    const getCoords = (values: SelectionValues) => [
      {
        y: values.top,
        x: values.left,
      },
      {
        y: values.top + values.height,
        x: values.left + values.width,
      },
    ];
    const [selectionStart, selectionEnd] = getCoords(selection);

    selectionCoveredNotes.current = renderedNotes
      .filter((note) => {
        const [noteStart, noteEnd] = getCoords(note);
        return (
          selectionStart.x <= noteStart.x &&
          selectionStart.y <= noteStart.y &&
          selectionEnd.x >= noteEnd.x &&
          selectionEnd.y >= noteEnd.y
        );
      })
      .map(note => {
        console.log(note);
        return note.id
      });
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>): void => {
    isMouseDown.current = true;

    setSelection({
      left: e.clientX - containerOffset.current.left,
      top: e.clientY - containerOffset.current.top,
      width: 0,
      height: 0,
    });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (isMouseDown.current) {
      setSelection({
        ...selection,
        width: e.clientX - containerOffset.current.left - selection.left,
        height: e.clientY - containerOffset.current.top - selection.top,
      });
    }
  };

  const handleMouseUp = (): void => {
    isMouseDown.current = false;
    dispatch(NoteActions.selectMultipleNotes(selectionCoveredNotes.current));
    setSelection({ left: 0, top: 0, width: 0, height: 0 });
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
          selectionMode={ noteSelectionMode }
          key={ note.id }
        />
      ));
    setNotesToRender(_notes);
  }, [currentCategoryNotes, selectedNotes, noteSelectionMode]);

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

interface SelectionValues {
  left: number;
  top: number;
  width: number;
  height: number;
}

const Selection = styled.div`
  position: absolute;
  z-index: 1;
  background: var(--primary200-60);
  border: 1px solid var(--primary100);
  opacity: 0.3;
`;

interface RenderedNote extends SelectionValues {
  id: EntityUid;
}
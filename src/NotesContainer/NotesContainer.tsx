import { ReactElement, useEffect, useRef, useState } from 'react';
import { NoteInterface } from '../domain/interfaces/note.interface';
import { Note } from '../Note/Note';
import { COLUMN_MIN_WIDTH_PX } from '../domain/consts/note-container.consts';
import { debounce } from '@material-ui/core';
import { Category } from '../domain/interfaces/category.interface';
import { rootCategory } from '../domain/consts/root-category.const';
import { useTranslation } from 'react-i18next';
import { Loader } from '../Loader/Loader';
import { LoaderCentered } from '../domain/enums/loader-centered.enum';
import { LoaderSize } from '../domain/enums/loader-size.enum';
import { EntityUid } from '../domain/types/entity-uid.type';
import { NoteSelectionMode } from '../domain/enums/note-selection-mode.enum';
import { NoNotesText, NotesWrapper } from './NotesContainer.styled';
import NoteActions from '../store/actionCreators/note.action-creators';
import UiActions from '../store/actionCreators/ui.action-creators';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectNotes,
  selectNoteSelectionMode,
  selectNotesLoading,
  selectSelectedNotes
} from '../store/selectors/note.selectors';
import { selectSelectedCategory } from '../store/selectors/category.selectors';
import { noNotesTextTestId } from '../domain/consts/test-ids.consts';

export const NotesContainer = (): ReactElement => {
  const { t } = useTranslation('COMMON');
  const notes: NoteInterface[] = useSelector(selectNotes);
  const notesLoading: boolean = useSelector(selectNotesLoading);
  const selectedCategory: Category | null = useSelector(selectSelectedCategory);
  const noteSelectionMode: NoteSelectionMode = useSelector(selectNoteSelectionMode);
  const selectedNotes = useSelector(selectSelectedNotes);
  const [currentCategoryNotes, setCurrentCategoryNotes] = useState<NoteInterface[]>([]);
  const [notesToRender, setNotesToRender] = useState<ReactElement[] | null>(null);
  const [numberOfColumns, setNumberOfColumns] = useState<number>(1);
  const containerRef = useRef<HTMLElement | null>(null);
  const noNotesText: ReactElement = <NoNotesText data-testid={ noNotesTextTestId }>{ t('NO_NOTES') }</NoNotesText>;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(NoteActions.get());
  }, []);

  useEffect(() => {
    calculateNumberOfColumns();
    initResizeListener();
  }, [notes]);

  useEffect(() => {
    if (selectedCategory.id === rootCategory.id) {
      setCurrentCategoryNotes(notes);
    } else {
      const filteredNotes = notes.filter((note) => note.categories.includes(selectedCategory.id));
      setCurrentCategoryNotes((filteredNotes));
    }
  }, [notes, selectedCategory]);

  useEffect(() => {
    const _notes: ReactElement[] = currentCategoryNotes
      .filter((note) => !note.deleted)
      .map((note) => (
        <Note
          onSelect={ handleNoteSelect }
          onOpen={ handleNoteOpen }
          data={ note }
          isSelected={ selectedNotes[note.id] }
          selectionMode={ noteSelectionMode }
          key={ note.id }
        />
      ));
    setNotesToRender(_notes);
  }, [currentCategoryNotes, selectedNotes, noteSelectionMode]);

  const initResizeListener = (): void => {
    window.addEventListener('resize', debounce(calculateNumberOfColumns, 100));
  };

  const calculateNumberOfColumns = (): void => {
    const containerWidth: number = containerRef.current!.clientWidth;
    const theoreticalNumberOfColumns: number = Math.floor(containerWidth / COLUMN_MIN_WIDTH_PX) || 1;
    setNumberOfColumns(Math.min(theoreticalNumberOfColumns, notes.length));
  };

  const handleNoteSelect = (noteId: EntityUid): void => {
    dispatch(NoteActions.selectNote(noteId));
  };

  const handleNoteOpen = (noteToOpen: NoteInterface): void => {
    dispatch(NoteActions.setOpenedNote(noteToOpen));
    dispatch(UiActions.openNoteDialog());
  };

  return (
    <NotesWrapper ref={ containerRef } columns={ numberOfColumns }>
      { notesLoading
        ? <Loader absolute={ true } centered={ LoaderCentered.Horizontally } size={ LoaderSize.Medium } />
        : notesToRender
          ? notesToRender.length
            ? notesToRender
            : noNotesText
          : null
      }
    </NotesWrapper>
  );
};

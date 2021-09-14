import { ReactElement, useEffect, useRef, useState } from 'react';
import { NoteInterface } from '../domain/interfaces/note.interface';
import { MainState } from '../store/interfaces/main-state.interface';
import { bindActionCreators, Dispatch } from 'redux';
import * as noteActions from '../store/actions/note.actions';
import { connect } from 'react-redux';
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
import { NoNotesText, NotesWrapper } from './NotesContainer.styles';

interface Props {
  notes: NoteInterface[];
  notesLoading: boolean;
  noteSelectionMode: NoteSelectionMode;
  selectedCategory: Category;
  noteActions: any;
}

export const NotesContainerComponent = (
  { notes, notesLoading, noteSelectionMode, selectedCategory, noteActions }: Props
): ReactElement => {
  const { t } = useTranslation('MAIN');
  const [currentCategoryNotes, setCurrentCategoryNotes] = useState<NoteInterface[]>([]);
  const [notesToRender, setNotesToRender] = useState<ReactElement[] | null>(null);
  const [numberOfColumns, setNumberOfColumns] = useState<number>(1);
  const [selectedNotes, setSelectedNotes] = useState<Record<EntityUid, boolean>>({});
  const containerRef = useRef<HTMLElement | null>(null);
  const noNotesText: ReactElement = <NoNotesText>{ t('NO_NOTES') }</NoNotesText>;

  useEffect(() => {
    noteActions.get();
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
    const _notes: ReactElement[] = currentCategoryNotes.map((note) => (
      <Note
        onSelect={ handleNoteSelect }
        data={ note }
        isSelected={ selectedNotes[note.id] }
        selectionMode={ noteSelectionMode }
        key={ note.id }
      />
    ));
    setNotesToRender(_notes);
  }, [currentCategoryNotes, selectedNotes]);

  const initResizeListener = (): void => {
    window.addEventListener('resize', debounce(calculateNumberOfColumns, 100));
  };

  const calculateNumberOfColumns = (): void => {
    const containerWidth: number = containerRef.current!.clientWidth;
    const theoreticalNumberOfColumns: number = Math.floor(containerWidth / COLUMN_MIN_WIDTH_PX) || 1;
    setNumberOfColumns(Math.min(theoreticalNumberOfColumns, notes.length));
  };

  const handleNoteSelect = (noteId: EntityUid): void => {
    setSelectedNotes({
      ...(noteSelectionMode === NoteSelectionMode.Multi ? selectedNotes : {}),
      [noteId]: !selectedNotes[noteId]
    });
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

const mapStateToProps = ({ note, category }: MainState) => ({
  notes: note.notes,
  notesLoading: note.notesLoading,
  noteSelectionMode: note.noteSelectionMode,
  selectedCategory: category.selectedCategory,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  noteActions: bindActionCreators(noteActions, dispatch),
});

export const NotesContainer = connect(mapStateToProps, mapDispatchToProps)(NotesContainerComponent);
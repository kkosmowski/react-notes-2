import { ReactElement, useEffect, useRef, useState } from 'react';
import { NoteInterface } from '../domain/interfaces/note.interface';
import { MainState } from '../store/interfaces/main-state.interface';
import { bindActionCreators, Dispatch } from 'redux';
import * as noteActions from '../store/actions/note.actions';
import { connect } from 'react-redux';
import { Note } from '../Note/Note';
import styled from 'styled-components';
import { COLUMN_MIN_WIDTH_PX } from '../domain/consts/note-container.consts';
import { CircularProgress, debounce } from '@material-ui/core';
import { Category } from '../domain/interfaces/category.interface';
import { rootCategory } from '../domain/consts/root-category.const';
import { useTranslation } from 'react-i18next';
import { Loader } from '../Loader/Loader';
import { LoaderCentered } from '../domain/enums/loader-centered.enum';
import { LoaderSize } from '../domain/enums/loader-size.enum';

interface Props {
  notes: NoteInterface[];
  notesLoading: boolean;
  selectedCategory: Category;
  noteActions: any;
}

export const NotesContainerComponent = (
  { notes, notesLoading, selectedCategory, noteActions }: Props
): ReactElement => {
  const { t } = useTranslation('MAIN');
  const [currentCategoryNotes, setCurrentCategoryNotes] = useState<NoteInterface[]>([]);
  const [notesToRender, setNotesToRender] = useState<ReactElement[] | null>(null);
  const [numberOfColumns, setNumberOfColumns] = useState<number>(1);
  const containerRef = useRef<HTMLElement | null>(null);
  const noNotesText: ReactElement = <NoNotesText>{ t('NO_NOTES') }</NoNotesText>;

  useEffect(() => {
    noteActions.get();
    calculateNumberOfColumns();
    initResizeListener();
  }, []);

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
      <Note data={ note } key={ note.id } />
    ));
    setNotesToRender(_notes);
  }, [currentCategoryNotes]);

  const initResizeListener = (): void => {
    window.addEventListener('resize', debounce(calculateNumberOfColumns, 100));
  };

  const calculateNumberOfColumns = (): void => {
    const containerWidth: number = containerRef.current!.clientWidth;
    setNumberOfColumns(Math.floor(containerWidth / COLUMN_MIN_WIDTH_PX) || 1);
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

const NotesWrapper = styled.section<{ columns: number }>`
  position: relative;
  display: grid; // @todo to optional refactor into custom masonry
  grid-template-columns: repeat(${ ({ columns }) => columns }, 1fr);
  grid-gap: 8px;
  padding: var(--wrapper-horizontal-padding);
`;

const NoNotesText = styled.p`
  color: var(--white-60);
`;

const mapStateToProps = ({ note, category }: MainState) => ({
  notes: note.notes,
  notesLoading: note.notesLoading,
  selectedCategory: category.selectedCategory,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  noteActions: bindActionCreators(noteActions, dispatch),
});

export const NotesContainer = connect(mapStateToProps, mapDispatchToProps)(NotesContainerComponent);
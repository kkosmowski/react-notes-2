import { ReactElement, useEffect, useRef, useState } from 'react';
import { NoteInterface } from '../domain/interfaces/note.interface';
import { MainState } from '../store/interfaces/main-state.interface';
import { bindActionCreators, Dispatch } from 'redux';
import * as noteActions from '../store/actions/note.actions';
import { connect } from 'react-redux';
import { Note } from '../Note/Note';
import styled from 'styled-components';
import { COLUMN_MIN_WIDTH_PX } from '../domain/consts/note-container.consts';
import { debounce } from '@material-ui/core';

interface Props {
  notes: NoteInterface[];
  noteActions: any;
}

export const NotesContainerComponent = ({ notes, noteActions }: Props): ReactElement => {
  const [numberOfColumns, setNumberOfColumns] = useState<number>(1);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    noteActions.get();
    calculateNumberOfColumns();
    initResizeListener();
  }, []);

  const initResizeListener = (): void => {
    window.addEventListener('resize', debounce(calculateNumberOfColumns, 100));
  };

  const calculateNumberOfColumns = (): void => {
    const containerWidth: number = containerRef.current!.clientWidth;
    setNumberOfColumns(Math.floor(containerWidth / COLUMN_MIN_WIDTH_PX) || 1);
  };

  return (
    <NotesWrapper ref={ containerRef } columns={ numberOfColumns }>
      { notes.map((note) => (
        <Note data={ note } key={ note.id } />
      )) }
    </NotesWrapper>
  );
};

const NotesWrapper = styled.section<{ columns: number }>`
  display: grid; // @todo to optional refactor into custom masonry
  grid-template-columns: repeat(${ ({ columns }) => columns }, 1fr);
  grid-gap: 8px;
  padding: var(--wrapper-horizontal-padding);
`;

const mapStateToProps = ({ note }: MainState) => ({
  notes: note.notes
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  noteActions: bindActionCreators(noteActions, dispatch),
});

export const NotesContainer = connect(mapStateToProps, mapDispatchToProps)(NotesContainerComponent);
import { MouseEvent, ReactElement } from 'react';
import styled from 'styled-components';
import { ControlsBar } from './ControlsBar/ControlsBar';
import { NoteDialog } from '../NoteDialog/NoteDialog';
import { ConfirmationDialog } from '../ConfirmationDialog/ConfirmationDialog';
import { NotesContainer } from '../NotesContainer/NotesContainer';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentCategory } from '../store/selectors/category.selectors';
import { Category } from '../domain/interfaces/category.interface';
import { Snackbar } from '../Snackbar/Snackbar';
import NoteActions from '../store/actionCreators/note.action-creators';
import { NoteSelectionMode } from '../domain/enums/note-selection-mode.enum';
import { selectNoteSelectionMode, selectSelectedNotes } from '../store/selectors/note.selectors';
import { EntityUid } from '../domain/types/entity-uid.type';
import { SnackbarWrapper } from '../Snackbar/SnackbarWrapper';

export const Main = (): ReactElement => {
  const selectedCategory: Category = useSelector(selectCurrentCategory);
  const selectedNotes: Record<EntityUid, boolean> = useSelector(selectSelectedNotes);
  const selectionMode: NoteSelectionMode = useSelector(selectNoteSelectionMode);
  const dispatch = useDispatch();

  const handleOnWrapperClick = (e: MouseEvent): void => {
    e.stopPropagation();
    if (selectionMode === NoteSelectionMode.Single && Object.values(selectedNotes).length) {
      dispatch(NoteActions.clearSelection());
    }
  };

  const handleOnWrapperDoubleClick = (e: MouseEvent): void => {
    e.stopPropagation();
    if (selectionMode === NoteSelectionMode.Multi && Object.values(selectedNotes).length) {
      dispatch(NoteActions.clearSelection());
    }
  };

  return (
    <MainWrapper
      onClick={ handleOnWrapperClick }
      onDoubleClick={ handleOnWrapperDoubleClick }
    >
      <CategoryTitle>{ selectedCategory.name }</CategoryTitle>
      <ControlsBar />
      <NotesContainer />

      <NoteDialog />
      <ConfirmationDialog />
      <SnackbarWrapper />
    </MainWrapper>
  );
};

const MainWrapper = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--dark300);
  padding: 16px 0;
  color: var(--white);
`;

const CategoryTitle = styled.h1`
  display: inline-block;
  font-size: 36px;
  font-weight: inherit;
  margin: 0 var(--wrapper-horizontal-padding) 16px;
`;
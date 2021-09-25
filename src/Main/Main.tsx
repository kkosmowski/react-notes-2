import { ReactElement } from 'react';
import styled from 'styled-components';
import { ControlsBar } from './ControlsBar/ControlsBar';
import { NoteDialog } from '../NoteDialog/NoteDialog';
import { ConfirmationDialog } from '../ConfirmationDialog/ConfirmationDialog';
import { NotesContainer } from '../NotesContainer/NotesContainer';
import { useSelector } from 'react-redux';
import { selectSelectedCategory } from '../store/selectors/category.selectors';
import { Category } from '../domain/interfaces/category.interface';
import { Snackbar } from '../Snackbar/Snackbar';

export const Main = (): ReactElement => {
  const selectedCategory: Category = useSelector(selectSelectedCategory);

  return (
    <MainWrapper>
      <CategoryTitle>{ selectedCategory.name }</CategoryTitle>
      <ControlsBar />
      <NotesContainer />

      <NoteDialog />
      <ConfirmationDialog />
      <Snackbar />
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
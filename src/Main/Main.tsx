import { ReactElement } from 'react';
import styled from 'styled-components';
import { ControlsBar } from './ControlsBar/ControlsBar';
import { NoteDialog } from '../NoteDialog/NoteDialog';
import { ConfirmationDialog } from '../ConfirmationDialog/ConfirmationDialog';
import { Category } from '../domain/interfaces/category.interface';
import { MainState } from '../store/interfaces/main-state.interface';
import { bindActionCreators, Dispatch } from 'redux';
import * as categoryActions from '../store/actions/category.actions';
import { connect } from 'react-redux';
import { NotesContainer } from '../NotesContainer/NotesContainer';

interface Props {
  selectedCategory: Category;
}

export const MainComponent = ({ selectedCategory }: Props): ReactElement => {
  return (
    <MainWrapper>
      <CategoryTitle>{ selectedCategory.name }</CategoryTitle>
      <ControlsBar />
      <NotesContainer />

      <NoteDialog />
      <ConfirmationDialog />
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

const mapStateToProps = ({ category }: MainState) => ({
  selectedCategory: category.selectedCategory,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  categoryActions: bindActionCreators(categoryActions, dispatch),
});

export const Main = connect(mapStateToProps, mapDispatchToProps)(MainComponent);

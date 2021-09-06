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

interface Props {
  selectedCategory: Category;
}

export const MainComponent = ({ selectedCategory }: Props): ReactElement => {
  return (
    <MainWrapper>
      <CategoryTitle>{ selectedCategory.name }</CategoryTitle>
      <ControlsBar />

      <NoteDialog />
      <ConfirmationDialog />
    </MainWrapper>
  );
};

const MainWrapper = styled.main`
  flex: 1;
  background-color: var(--dark300);
  padding: 16px var(--wrapper-horizontal-padding);
  color: var(--white);
`;

const CategoryTitle = styled.h1`
  font-size: 36px;
  font-weight: inherit;
  margin: 0 0 8px;
`;

const mapStateToProps = ({ category }: MainState) => ({
  selectedCategory: category.selectedCategory,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  categoryActions: bindActionCreators(categoryActions, dispatch),
});

export const Main = connect(mapStateToProps, mapDispatchToProps)(MainComponent);

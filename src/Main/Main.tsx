import { ReactElement } from 'react';
import styled from 'styled-components';
import { ControlsBar } from './ControlsBar/ControlsBar';
import { NoteDialog } from '../NoteDialog/NoteDialog';
import { ConfirmationDialog } from '../ConfirmationDialog/ConfirmationDialog';

export const Main = (): ReactElement => {

  return (
    <MainWrapper>
      <CategoryTitle>All</CategoryTitle>
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
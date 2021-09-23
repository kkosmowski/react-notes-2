import { ReactElement } from 'react';
import styled from 'styled-components';
import { AddNoteButton } from './AddNoteButton';
import UiActions from '../../store/actionCreators/ui.action-creators';
import { useDispatch } from 'react-redux';

export const ControlsBar = (): ReactElement => {
  const dispatch = useDispatch();

  const handleNoteAdd = () => {
    dispatch(UiActions.openNoteDialog());
  };

  return (
    <Bar>
      <AddNoteButton onClick={ handleNoteAdd } />
      {/*<DeleteNotesButton />*/ }
    </Bar>
  );
};

const Bar = styled.div`
  padding: 8px var(--wrapper-horizontal-padding);
  background-color: var(--dark200);
`;

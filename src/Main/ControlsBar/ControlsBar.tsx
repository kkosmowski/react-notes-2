import { ReactElement } from 'react';
import styled from 'styled-components';
import { AddNoteButton } from './AddNoteButton';
import { connect } from 'react-redux';
import { MainState } from '../../store/interfaces/main-state.interface';
import { bindActionCreators, Dispatch } from 'redux';
import * as uiActions from '../../store/actions/ui.actions';
import { UiState } from '../../store/interfaces/ui-state.interface';

interface Props extends UiState {
  uiActions: any;
}

type ControlsBarProps = Pick<Props, 'noteDialogOpened' | 'uiActions'>;

const ControlsBarComponent = ({ noteDialogOpened, uiActions }: ControlsBarProps): ReactElement => {
  const handleNoteAdd = () => {
    uiActions.openNoteDialog();
  };

  return (
    <Bar>
      <AddNoteButton onClick={ handleNoteAdd } />
      {/*<DeleteNotesButton />*/ }
    </Bar>
  );
};

const Bar = styled.div`
  padding: 8px 16px 8px var(--wrapper-horizontal-padding);
  margin-left: calc(-1 * var(--wrapper-horizontal-padding));
  background-color: var(--dark200);
`;

const mapStateToProps = ({ ui }: MainState) => ({
  noteDialogOpened: ui.noteDialogOpened,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  uiActions: bindActionCreators(uiActions, dispatch),
});

export const ControlsBar = connect(mapStateToProps, mapDispatchToProps)(ControlsBarComponent);
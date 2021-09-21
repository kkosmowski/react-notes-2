import { ReactElement } from 'react';
import { DialogConfig } from '../domain/interfaces/dialog-config.interface';
import { Dialog } from '../Dialog/Dialog';
import { DialogTitle } from '../Dialog/DialogTitle';
import { MainState } from '../store/interfaces/main-state.interface';
import { bindActionCreators, Dispatch } from 'redux';
import * as uiActions from '../store/actionCreators/ui.action-creators';
import { connect } from 'react-redux';
import { ConfirmationDialogData } from '../domain/interfaces/confirmation-dialog-data.interface';
import { DialogControls } from '../Dialog/styles/Dialog.styles';
import styled from 'styled-components';

interface Props {
  opened: boolean;
  data: ConfirmationDialogData | null;
  uiActions: any;
}

export const ConfirmationDialogComponent = ({ opened, data, uiActions }: Props): ReactElement => {
  const config: DialogConfig = {
    width: '360px',
    height: 'auto',
    flex: true
  };

  const handleCancel = (): void => {
    uiActions.closeConfirmationDialog(false);
  };

  const handleConfirm = (): void => {
    uiActions.closeConfirmationDialog(true);
  };

  return (
    <Dialog
      opened={ opened }
      config={ config }
    >
      <DialogTitle>{ data ? data.title : '' }</DialogTitle>

      <Message>{ data ? data.message : '' }</Message>

      <DialogControls>
        <button
          onClick={ handleCancel }
          className="button --regular"
          type="button"
        >{ data ? data.cancelButtonText : '' }</button>
        <button
          onClick={ handleConfirm }
          className="button --contained --primary"
          type="button"
        >{ data ? data.confirmButtonText : '' }</button>
      </DialogControls>
    </Dialog>
  );
};

const Message = styled.p`
  margin: 16px 0;
`;

const mapStateToProps = ({ ui }: MainState) => ({
  opened: ui.confirmationDialogOpened,
  data: ui.confirmationDialogData
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  uiActions: bindActionCreators(uiActions, dispatch),
});

export const ConfirmationDialog = connect(mapStateToProps, mapDispatchToProps)(ConfirmationDialogComponent);
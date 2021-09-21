import { ReactElement } from 'react';
import { DialogConfig } from '../domain/interfaces/dialog-config.interface';
import { Dialog } from '../Dialog/Dialog';
import { DialogTitle } from '../Dialog/DialogTitle';
import { DialogControls } from '../Dialog/styles/Dialog.styles';
import styled from 'styled-components';
import UiActions from '../store/actionCreators/ui.action-creators';


export const ConfirmationDialog = (): ReactElement => {
  const config: DialogConfig = {
    width: '360px',
    height: 'auto',
    flex: true
  };

  const handleCancel = (): void => {
    UiActions.closeConfirmationDialog(false);
  };

  const handleConfirm = (): void => {
    UiActions.closeConfirmationDialog(true);
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

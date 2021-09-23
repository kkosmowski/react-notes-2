import { ReactElement } from 'react';
import { DialogConfig } from '../domain/interfaces/dialog-config.interface';
import { Dialog } from '../Dialog/Dialog';
import { DialogTitle } from '../Dialog/DialogTitle';
import { DialogControls } from '../Dialog/styles/Dialog.styles';
import styled from 'styled-components';
import UiActions from '../store/actionCreators/ui.action-creators';
import { useDispatch, useSelector } from 'react-redux';
import { selectConfirmationData, selectConfirmationDialogOpened } from '../store/selectors/ui.selectors';
import { ConfirmationDialogData } from '../domain/interfaces/confirmation-dialog-data.interface';

export const ConfirmationDialog = (): ReactElement => {
  const opened: boolean = useSelector(selectConfirmationDialogOpened);
  const data: ConfirmationDialogData | null = useSelector(selectConfirmationData);
  const dispatch = useDispatch();
  const dialogConfig: DialogConfig = {
    width: '360px',
    height: 'auto',
    flex: true
  };

  const handleCancel = (): void => {
    dispatch(UiActions.closeConfirmationDialog(false));
  };

  const handleConfirm = (): void => {
    dispatch(UiActions.closeConfirmationDialog(true));
  };

  return (
    <Dialog
      opened={ opened }
      config={ dialogConfig }
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

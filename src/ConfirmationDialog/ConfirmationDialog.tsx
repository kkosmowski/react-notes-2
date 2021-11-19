import { ReactElement, useEffect, useState } from 'react';
import { DialogConfig } from '../domain/interfaces/dialog-config.interface';
import { Dialog } from '../Dialog/Dialog';
import { DialogTitle } from '../Dialog/DialogTitle';
import { DialogControls } from '../Dialog/styles/Dialog.styled';
import styled from 'styled-components/macro';
import UiActions from '../store/actionCreators/ui.action-creators';
import { useDispatch, useSelector } from 'react-redux';
import { selectConfirmationAction, selectConfirmationDialogOpened } from '../store/selectors/ui.selectors';
import { ConfirmationAction } from '../domain/enums/confirmation-action.enum';
import { ConfirmationDialogData } from '../domain/interfaces/confirmation-dialog-data.interface';
import { getConfirmationDialogData } from './get-confirmation-dialog-data.util';
import { useTranslation } from 'react-i18next';
import { confirmationDialogTestId } from '../domain/consts/test-ids.consts';
import { selectSelectedNotesCount } from '../store/selectors/note.selectors';

export const ConfirmationDialog = (): ReactElement => {
  const { t } = useTranslation('CONFIRMATION');
  const opened: boolean = useSelector(selectConfirmationDialogOpened);
  const action: ConfirmationAction | null = useSelector(selectConfirmationAction);
  const selectedNotesCount: number = useSelector(selectSelectedNotesCount);
  const [data, setData] = useState<ConfirmationDialogData | null>(null);
  const dispatch = useDispatch();
  const dialogConfig: DialogConfig = {
    width: '400px',
    height: 'auto',
    flex: true
  };

  useEffect(() => {
    setData(getConfirmationDialogData(action, selectedNotesCount));
  }, [action, setData, selectedNotesCount]);

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
      testid={ confirmationDialogTestId }
    >
      <DialogTitle>{ data && t(data.title) }</DialogTitle>

      <Message>{ data && t(data.message) }</Message>

      <DialogControls>
        <button
          onClick={ handleCancel }
          className="button --regular"
          type="button"
        >{ data && t(data.cancelButtonText) }</button>
        <button
          onClick={ handleConfirm }
          className="button --contained --primary"
          type="button"
        >{ data && t(data.confirmButtonText) }</button>
      </DialogControls>
    </Dialog>
  );
};

const Message = styled.p`
  margin: 16px 0;
  line-height: 1.6;
  white-space: pre-wrap;
`;

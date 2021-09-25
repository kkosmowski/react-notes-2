import { ReactElement, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSnackbarVisible } from '../store/selectors/ui.selectors';
import { SnackbarTimeIndicator } from './SnackbarTimeIndicator';
import UiActions from '../store/actionCreators/ui.action-creators';
import { SnackbarActions, SnackbarContent, SnackbarMessage, SnackbarWrapper } from './Snackbar.styled';
import { Close } from '@material-ui/icons';
import { Action } from '../domain/interfaces/action.interface';
import historyActions from '../store/actions/history.actions';
import { HistoryUtil } from '../domain/utils/history.util';
import { selectLastAction } from '../store/selectors/history.selectors';
import { snackbarDuration } from '../domain/consts/snackbar.const';
import { useTranslation } from 'react-i18next';
import { getSnackbarMessageBasedOnAction } from './get-snackbar-message-based-on-action.util';

export const Snackbar = (): ReactElement | null => {
  const { t } = useTranslation('MAIN');
  const visible: boolean = useSelector(selectSnackbarVisible);
  const lastAction: Action | null = useSelector(selectLastAction);
  const dispatch = useDispatch();
  const [message, setMessage] = useState<string>('');
  const [undoButtonDisabled, setUndoButtonDisabled] = useState<boolean>(false);
  const timeout = useRef<any>(); // @todo avoid any

  useEffect(() => {
    setUndoButtonDisabled(!lastAction);
    setSnackbarMessage();
  }, [lastAction]);

  useEffect(() => {
    if (visible) {
      setSnackbarTimeout();
    }
    return () => clearTimeout(timeout.current);
  }, [visible]);

  const setSnackbarTimeout = (): void => {
    timeout.current = setTimeout(() => hideSnackbar(), snackbarDuration);
  };

  const setSnackbarMessage = (): void => {
    if (lastAction) {
      setMessage(getSnackbarMessageBasedOnAction(lastAction));
    }
  };

  const handleUndoButtonClick = (): void => {
    if (lastAction) {
      dispatch(historyActions.pop());
      dispatch(HistoryUtil.getRevertedAction(lastAction));
      dispatch(UiActions.hideSnackbar());
    } else {
    }
  };

  const hideSnackbar = (): void => {
    dispatch(UiActions.hideSnackbar());
  };

  return visible
    ? (
      <SnackbarWrapper>
        <SnackbarTimeIndicator duration={ snackbarDuration } />
        <SnackbarContent>
          <SnackbarMessage>{ t(message) }</SnackbarMessage>
          <SnackbarActions>
            <button
              onClick={ handleUndoButtonClick }
              className="button --contained --primary"
              type="button"
              disabled={ undoButtonDisabled }
            >
              { t('UNDO') }
            </button>

            <button
              onClick={ hideSnackbar }
              className="button --icon --small"
              type="button"
            >
              <Close />
            </button>
          </SnackbarActions>
        </SnackbarContent>
      </SnackbarWrapper>
    )
    : null;
};

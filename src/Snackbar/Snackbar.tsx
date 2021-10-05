import { ReactElement, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { SnackbarTimeIndicator } from './SnackbarTimeIndicator';
import {
  SnackbarActions,
  SnackbarContent,
  SnackbarMessage,
  SnackbarWrapper
} from './Snackbar.styled';
import { Close } from '@material-ui/icons';
import historyActions from '../store/actions/history.actions';
import { HistoryUtil } from '../domain/utils/history.util';
import { useTranslation } from 'react-i18next';
import {
  getSnackbarMessageBasedOnAction,
  TranslationData
} from './get-snackbar-message-based-on-action.util';
import { ActionDetails } from '../domain/interfaces/action-details.interface';
import { Button } from '../Button/Button';
import { Variant } from '../domain/enums/variant.enum';
import { Color } from '../domain/enums/color.enum';
import { snackbarDuration, snackbarHidingDuration } from '../domain/consts/snackbar.const';
import UiActions from '../store/actionCreators/ui.action-creators';

interface Props {
  details: ActionDetails;
}

export const Snackbar = ({ details }: Props): ReactElement | null => {
  const { t } = useTranslation('SNACKBAR');
  const [visible, setVisible] = useState<boolean>(true);
  const [hiding, setHiding] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [translation, setTranslation] = useState<TranslationData>({ message: '' });
  const [undoButtonVisible, setUndoButtonVisible] = useState<boolean>(false);
  const [undoButtonDisabled, setUndoButtonDisabled] = useState<boolean>(false);
  const timeout = useRef<any>(); // @todo avoid any

  useEffect(() => {
    setSnackbarTimeout();
    setUndoButtonVisible(details.reversible);
    setSnackbarMessage();
    return () => hideSnackbar();
  }, []);

  const setSnackbarTimeout = (): void => {
    timeout.current = setTimeout(() => hideSnackbar(), snackbarDuration + snackbarHidingDuration);
  };

  const setSnackbarMessage = (): void => {
    setTranslation(getSnackbarMessageBasedOnAction(details));
  };

  const handleUndoButtonClick = (): void => {
    if (details.reversible && !undoButtonDisabled) {
      dispatch(historyActions.pop());
      dispatch(HistoryUtil.getRevertedAction(details));
      setUndoButtonDisabled(true);
    }
  };

  const hideSnackbar = (): void => {
    setHiding(true);
    setTimeout(() => {
      setVisible(false);
      dispatch(UiActions.hideSnackbar());
      // @todo fix hide action that is dispatched twice (when snackbar is hidden) + third time after ~8s (when snackbar is hidden manually)
    }, snackbarHidingDuration);
  };

  return visible
    ? (
      <SnackbarWrapper className={ 'snackbar' + (hiding ? ' --hiding' : '') }>
        <SnackbarTimeIndicator duration={ snackbarDuration } />
        <SnackbarContent>
          <SnackbarMessage>{ t(translation.message, translation.options) }</SnackbarMessage>
          <SnackbarActions>
            { undoButtonVisible
              ? <Button
                onClick={ handleUndoButtonClick }
                variant={ Variant.Contained }
                color={ Color.Primary }
                disabled={ undoButtonDisabled }
              >
                { t('UNDO') }
              </Button>
              : null
            }

            <Button
              onClick={ hideSnackbar }
              variant={ Variant.Icon }
              small
            >
              <Close />
            </Button>
          </SnackbarActions>
        </SnackbarContent>
      </SnackbarWrapper>
    )
    : null;
};

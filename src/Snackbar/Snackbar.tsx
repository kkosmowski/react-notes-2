import { ReactElement, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSnackbarVisible } from '../store/selectors/ui.selectors';
import { SnackbarTimeIndicator } from './SnackbarTimeIndicator';
import UiActions from '../store/actionCreators/ui.action-creators';
import {
  SnackbarActions,
  SnackbarContent,
  SnackbarMessage,
  SnackbarWrapper
} from './Snackbar.styled';
import { Close } from '@material-ui/icons';
import historyActions from '../store/actions/history.actions';
import { HistoryUtil } from '../domain/utils/history.util';
import { selectLastAction } from '../store/selectors/history.selectors';
import { useTranslation } from 'react-i18next';
import {
  getSnackbarMessageBasedOnAction,
  TranslationData
} from './get-snackbar-message-based-on-action.util';
import { ActionDetails } from '../domain/interfaces/action-details.interface';
import { Button } from '../Button/Button';
import { Variant } from '../domain/enums/variant.enum';
import { Color } from '../domain/enums/color.enum';

interface Props {
  duration: number;
}

export const Snackbar = ({ duration }: Props): ReactElement | null => {
  const { t } = useTranslation('SNACKBAR');
  const [visible, setVisible] = useState<boolean>(true);
  const lastAction: ActionDetails | null = useSelector(selectLastAction);
  const dispatch = useDispatch();
  const [translation, setTranslation] = useState<TranslationData>({ message: '' });
  const [undoButtonVisible, setUndoButtonVisible] = useState<boolean>(false);
  const timeout = useRef<any>(); // @todo avoid any

  useEffect(() => {
    setUndoButtonVisible(!lastAction || lastAction.reversible);
    setSnackbarMessage();
  }, [lastAction]);

  useEffect(() => {
    if (visible) {
      setSnackbarTimeout();
    }
    return () => clearTimeout(timeout.current);
  }, [duration]);

  const setSnackbarTimeout = (): void => {
    timeout.current = setTimeout(() => hideSnackbar(), duration);
  };

  const setSnackbarMessage = (): void => {
    if (lastAction) {
      setTranslation(getSnackbarMessageBasedOnAction(lastAction));
    }
  };

  const handleUndoButtonClick = (): void => {
    if (lastAction && lastAction.reversible) {
      dispatch(historyActions.pop());
      dispatch(HistoryUtil.getRevertedAction(lastAction));
      hideSnackbar();
    }
  };

  const hideSnackbar = (): void => {
    setVisible(false);
  };

  return visible
    ? (
      <SnackbarWrapper>
        <SnackbarTimeIndicator duration={ duration } />
        <SnackbarContent>
          <SnackbarMessage>{ t(translation.message, translation.options) }</SnackbarMessage>
          <SnackbarActions>
            { undoButtonVisible
              ? <Button
                onClick={ handleUndoButtonClick }
                variant={ Variant.Contained }
                color={ Color.Primary}
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

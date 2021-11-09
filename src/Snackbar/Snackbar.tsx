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
import { snackbarCloseButtonTestId, snackbarTestId } from '../domain/consts/test-ids.consts';
import HistoryActions from '../store/actionCreators/history.action-creators';
import { EntityUid } from '../domain/types/entity-uid.type';

interface Props {
  id: EntityUid;
  details: ActionDetails;
}

export const Snackbar = ({ id, details }: Props): ReactElement | null => {
  const { t } = useTranslation('SNACKBAR');
  const [visible, setVisible] = useState<boolean>(true);
  const [hiding, setHiding] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [translation, setTranslation] = useState<TranslationData>({ message: '' });
  const [undoButtonVisible, setUndoButtonVisible] = useState<boolean>(false);
  const [undoButtonDisabled, setUndoButtonDisabled] = useState<boolean>(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setSnackbarTimeout();
    setUndoButtonVisible(details.reversible);
    setSnackbarMessage();
  }, []);

  const setSnackbarTimeout = (): void => {
    timeout.current = setTimeout(() => hideSnackbar(), snackbarDuration + snackbarHidingDuration);
  };

  const setSnackbarMessage = (): void => {
    setTranslation(getSnackbarMessageBasedOnAction(details));
  };

  const handleUndoButtonClick = (): void => {
    if (details.reversible && !undoButtonDisabled) {
      dispatch(HistoryActions.pop());
      dispatch(HistoryUtil.getRevertedAction(details));
      setUndoButtonDisabled(true);
      hideSnackbar(500);
    }
  };

  const hideSnackbar = (additionalDelay = 0): void => {
    setTimeout(() => {
      setHiding(true);
      clearTimeout(timeout.current!);
      setTimeout(() => {
        setVisible(false);
        dispatch(UiActions.hideSnackbar(id));
      }, snackbarHidingDuration);
    }, additionalDelay);
  };

  return visible
    ? (
      <SnackbarWrapper
        className={ 'snackbar' + (hiding ? ' --hiding' : '') }
        data-testid={ snackbarTestId }
      >
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
              onClick={ () => hideSnackbar() }
              variant={ Variant.Icon }
              testid={ snackbarCloseButtonTestId }
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

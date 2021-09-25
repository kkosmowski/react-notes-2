import { Action } from '../../domain/interfaces/action.interface';
import { ActionFunction } from '../../domain/types/action-function.type';
import { Dispatch } from 'redux';
import historyActions from '../actions/history.actions';
import UiActions from './ui.action-creators';

const HistoryActions = {
  push(action: Action): ActionFunction<void> {
    return function (dispatch: Dispatch): void {
      dispatch(historyActions.push(action));
      dispatch(UiActions.showSnackbar(action));
    };
  }
};

export default HistoryActions;
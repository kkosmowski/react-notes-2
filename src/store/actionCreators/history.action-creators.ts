import { Action } from '../../domain/interfaces/action.interface';
import { ActionFunction } from '../../domain/types/action-function.type';
import { Dispatch } from 'redux';
import historyActions from '../actions/history.actions';
import UiActions from './ui.action-creators';
import { HistoryUtil } from '../../domain/utils/history.util';

const HistoryActions = {
  push(action: Action): ActionFunction<void> {
    return function (dispatch: Dispatch): void {
      dispatch(historyActions.push({
        action: {
          type: action.payload.type,
          payload: action.payload.payload,
        },
        reversible: HistoryUtil.isReversible(action.payload.type),
      }));
      dispatch(UiActions.showSnackbar(action));
    };
  },

  pop(): ActionFunction<void> {
    return function (dispatch: Dispatch): void {
      dispatch(historyActions.pop());
    };
  }
};

export default HistoryActions;
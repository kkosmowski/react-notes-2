import { ActionTypes } from '../../store/actions/actions.enum';

export interface Action {
  type: ActionTypes;
  payload?: any;
  error?: any;
}
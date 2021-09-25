import { Action } from '../../domain/interfaces/action.interface';

export interface HistoryState {
  records: Action[];
}
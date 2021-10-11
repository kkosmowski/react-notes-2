import { RootState } from '../interfaces/root-state.interface';
import { createSelector } from 'reselect';
import { HistoryState } from '../interfaces/history-state.interface';

export const selectLastAction = createSelector(
  (state: RootState) => state.history,
  (history: HistoryState) => history.records.length
    ? history.records[history.records.length - 1]
    : null
);
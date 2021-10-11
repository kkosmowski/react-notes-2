import { HistoryState } from '../interfaces/history-state.interface';
import { createReducer } from '@reduxjs/toolkit';
import historyActions from '../actions/history.actions';

export const initialHistoryState: HistoryState = {
  records: [],
};

const historyReducer = createReducer(initialHistoryState, (builder) => {
  builder
    .addCase(historyActions.push, (state, { payload }) => {
      state.records.push(payload);
    })
    .addCase(historyActions.pop, (state) => {
      state.records.pop();
    });
});

export default historyReducer;
import { HistoryState } from '../interfaces/history-state.interface';
import { createReducer } from '@reduxjs/toolkit';
import historyActions from '../actions/history.actions';

const initialState: HistoryState = {
  records: [],
};

const historyReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(historyActions.push, (state, { payload }) => {
      state.records.push(payload);
    })
    .addCase(historyActions.pop, (state) => {
      state.records.pop();
    });
});

export default historyReducer;
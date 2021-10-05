import { HistoryState } from '../interfaces/history-state.interface';
import { createReducer } from '@reduxjs/toolkit';
import historyActions from '../actions/history.actions';
import { HistoryUtil } from '../../domain/utils/history.util';

export const initialHistoryState: HistoryState = {
  records: [],
};

const historyReducer = createReducer(initialHistoryState, (builder) => {
  builder
    .addCase(historyActions.push, (state, { payload }) => {
      state.records.push({
        action: {
          type: payload.type,
          payload: payload.payload,
        },
        reversible: HistoryUtil.isReversible(payload.type),
      });
    })
    .addCase(historyActions.pop, (state) => {
      state.records.pop();
    });
});

export default historyReducer;
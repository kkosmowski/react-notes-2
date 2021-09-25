import { createAction } from '@reduxjs/toolkit';
import { Action } from '../../domain/interfaces/action.interface';

const historyActions = {
  push: createAction<Action>('PUSH_HISTORY'),
  pop: createAction<void>('POP_HISTORY'),
};

export default historyActions;
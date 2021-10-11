import { createAction } from '@reduxjs/toolkit';
import { ActionDetails } from '../../domain/interfaces/action-details.interface';

const historyActions = {
  push: createAction<ActionDetails>('PUSH_HISTORY'),
  pop: createAction<void>('POP_HISTORY'),
};

export default historyActions;
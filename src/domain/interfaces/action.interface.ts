import { ActionCreator } from '@reduxjs/toolkit';

export interface Action {
  type: ActionCreator<any>;
  payload?: any;
  error?: any;
}
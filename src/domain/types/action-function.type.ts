import { Dispatch } from 'redux';

export type ActionFunction<T> = (dispatch: Dispatch) => T;
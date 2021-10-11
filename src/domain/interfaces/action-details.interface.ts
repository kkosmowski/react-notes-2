import { Action } from './action.interface';

export interface ActionDetails {
  action: Action;
  reversible: boolean;
}
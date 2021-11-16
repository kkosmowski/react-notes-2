import { MouseEvent } from 'react';

export enum MouseAction {
  Up = 'Up',
  Move = 'Move',
  Down = 'Down',
}

export interface MouseActionPayload {
  action: MouseAction;
  event: MouseEvent;
}
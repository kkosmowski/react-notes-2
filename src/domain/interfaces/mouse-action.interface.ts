import { MouseEvent } from 'react';

export const enum MouseAction {
  Up = 'Up',
  Move = 'Move',
  Down = 'Down',
}

export interface MouseActionPayload {
  action: MouseAction;
  event: MouseEvent;
}
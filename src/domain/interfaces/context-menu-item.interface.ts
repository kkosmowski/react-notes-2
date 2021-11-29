import { MouseEvent } from 'react';

export interface ContextMenuItemInterface {
  label: string;
  callback: (e: MouseEvent) => void;
  warn?: boolean;
  multi?: boolean;
  testid?: string;
}

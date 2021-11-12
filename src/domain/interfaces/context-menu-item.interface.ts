import { MouseEvent } from 'react';

export interface ContextMenuItemInterface {
  label: string;
  warn?: boolean;
  testid?: string;
  callback: (e: MouseEvent) => void;
}

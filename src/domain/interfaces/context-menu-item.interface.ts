import { MouseEvent } from 'react';

export interface ContextMenuItemInterface {
  label: string;
  warn?: boolean;
  callback: (e: MouseEvent) => void;
}

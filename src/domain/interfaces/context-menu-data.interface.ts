import { Coords } from './coords.interface';
import { ContextMenuItemInterface } from './context-menu-item.interface';

export interface ContextMenuData {
  coords: Coords;
  items: ContextMenuItemInterface[];
}
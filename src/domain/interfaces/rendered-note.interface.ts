import { EntityUid } from '../types/entity-uid.type';
import { UICoords } from './ui-coords.interface';

export interface RenderedNote extends UICoords {
  id: EntityUid;
}
import { MouseEvent } from 'react';
import { Coords } from '../domain/interfaces/coords.interface';

export const handleEventAndReturnCoords = (e: MouseEvent): Coords => {
  e.stopPropagation();
  e.preventDefault();

  return {
    x: e.clientX,
    y: e.clientY,
  };
};
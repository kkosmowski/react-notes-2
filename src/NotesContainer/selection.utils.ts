import { MouseEvent } from 'react';
import { SelectionCoords } from '../domain/interfaces/selection-coords.interface';
import { UICoords } from '../domain/interfaces/ui-coords.interface';
import { XYCoords } from '../domain/interfaces/xy-coords.interface';

export const updateSelection = (selection: SelectionCoords, e: MouseEvent): SelectionCoords => {
  return {
    ...selection,
    ...(e.clientX - selection.startX >= 0
      ? { width: e.clientX - selection.left }
      : {
        width: Math.abs(e.clientX - selection.startX),
        left: e.clientX,
      }
    ),
    ...(e.clientY - selection.startY >= 0
      ? { height: e.clientY - selection.top }
      : {
        height: Math.abs(e.clientY - selection.startY),
        top: e.clientY,
      }
    ),
  };
};

export const getXYCoords = (uiCoords: UICoords): [XYCoords, XYCoords] => [
  {
    y: uiCoords.top,
    x: uiCoords.left,
  },
  {
    y: uiCoords.top + uiCoords.height,
    x: uiCoords.left + uiCoords.width,
  },
];
import styled, { css } from 'styled-components/macro';
import { ColorElementStyles } from './ColorPicker.styled';

export const ColorPickerGridWrapper = styled.div<{ opened: boolean; absolute?: boolean }>`
  ${ ({ absolute }) => absolute 
    ? css`
      position: absolute;
      z-index: 51;
      left: 0;
      top: 100%;
    `
    : '' }
  ${ ({ opened }) => `display: ${ opened ? 'grid' : 'none' };` }
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 8px;
  padding: 8px;
  background-color: var(--background250);
  align-self: center;
  
  .color-picker & {
    background-color: var(--background150);
  }
`;

interface ColorOptionInterface {
  color: string;
  baseColor: string;
  smallTiles?: boolean;
  isActive: boolean;
}

export const ColorOption = styled.div<ColorOptionInterface>`
  ${ ({ smallTiles }) => smallTiles 
    ? css`width: 24px; height: 24px;`
    : css`width: 48px; height: 32px;`
}
  ${ ({ isActive }) => isActive 
    ? css`box-shadow: 0 0 0 1px var(--primary100);`
    : '' }
  ${ ColorElementStyles };
`;
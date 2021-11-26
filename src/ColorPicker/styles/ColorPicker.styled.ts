import styled, { css } from 'styled-components/macro';

export const ColorPickerWrapper = styled.div`
  position: relative;
`;

export const ColorOverlay = css<{ color?: string }>`
  position: relative;
        
  > * {
    position: relative;
  }
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0.6;
    background-color: ${ ({ color }) => color };
  }
`;

export const NoteColorOverlay = css<{ color?: string }>`
  ${ ({ color }) => color && color !== 'transparent'
    ? css`
      ${ ColorOverlay }
      &::before {
        opacity: var(--note-color-opacity);
      }
      `
    : '' }
`;

export const CategoryColorOverlay = css<{ color?: string }>`
  ${ ({ color }) => color && color !== 'transparent'
    ? css`
      ${ ColorOverlay }
      &::before {
        opacity: 0.06;
      }
      `
    : '' }
`;

export const ColorElementStyles = css<{ color: string, baseColor?: string }>`
  border: 0;
  cursor: pointer;
  background-color: ${ ({ baseColor }) => baseColor || 'transparent' };
  ${ ColorOverlay };
`;

export const ColorPickerButton = styled.button<{ color: string, baseColor: string }>`
  appearance: none;
  width: 24px;
  height: 24px;
  box-shadow: 0 0 0 2px var(--foreground-16);
  ${ ColorElementStyles };
`;
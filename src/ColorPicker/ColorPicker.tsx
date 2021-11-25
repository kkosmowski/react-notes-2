import styled, { css } from 'styled-components/macro';
import { CSSProperties, ReactElement, useEffect, useState } from 'react';
import { COLORS } from './colors.const';
import { noteBackgroundColor } from '../Note/get-notes-styles.util';
import { Backdrop } from '../Backdrop/Backdrop';

interface Props {
  style?: CSSProperties;
  initialColor?: string;
  onColorChange: (color: string) => void;
}

export const ColorPicker = ({ style, initialColor, onColorChange }: Props): ReactElement => {
  const [opened, setOpened] = useState(false);
  const [currentColor, setCurrentColor] = useState('transparent');

  useEffect(() => {
    if (initialColor) {
      setCurrentColor(initialColor);
    }
  }, [setCurrentColor, initialColor]);

  const togglePopup = (): void => { setOpened(!opened); };

  const handleColorSelect = (color: string): void => {
    if (color !== currentColor) {
      setCurrentColor(color);
      onColorChange(color);
    }
    togglePopup();
  };

  return (
    <>
      <ColorPickerWrapper style={ style }>
        <ColorPickerButton
          onClick={ togglePopup }
          color={ currentColor }
          baseColor={ noteBackgroundColor }
        />
        <ColorPickerPopup opened={ opened }>
          { COLORS.map((color) => (
            <ColorOption
              onClick={ () => handleColorSelect(color) }
              color={ color }
              baseColor={ noteBackgroundColor }
              key={ color }
            />
          )) }
        </ColorPickerPopup>
      </ColorPickerWrapper>
      { opened && <Backdrop onClick={ togglePopup } /> }
    </>
  );
};

const ColorPickerWrapper = styled.div`
  position: relative;
`;

export const ColorOverlay = css<{ color?: string }>`
  ${ ({ color }) => color && color !== 'transparent' 
    ? css`
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
        opacity: var(--note-color-opacity);
        background-color: ${ color };
      }
      ` 
    : '' }
`;

const ColorElementStyles = css<{ color: string, baseColor?: string }>`
  width: 24px;
  height: 24px;
  border: 0;
  cursor: pointer;
  background-color: ${ ({ baseColor }) => baseColor || 'transparent' };
  ${ ColorOverlay };
`;

const ColorPickerButton = styled.button<{ color: string, baseColor: string }>`
  appearance: none;
  box-shadow: 0 0 0 2px var(--foreground-16);
  ${ ColorElementStyles };
`;

const ColorOption = styled.div<{ color: string, baseColor: string }>`
  ${ ColorElementStyles };
`;

const ColorPickerPopup = styled.div<{ opened: boolean }>`
  position: absolute;
  z-index: 51;
  left: 0;
  top: 100%;
  ${ ({ opened }) => `display: ${ opened ? 'grid' : 'none' };` }
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 8px;
  padding: 8px;
  background-color: var(--background150);
`;
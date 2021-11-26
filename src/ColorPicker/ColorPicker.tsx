import { CSSProperties, ReactElement, useEffect, useState } from 'react';
import { Backdrop } from '../Backdrop/Backdrop';
import { ColorPickerGrid } from './ColorPickerGrid';
import { ColorPickerButton, ColorPickerWrapper } from './styles/ColorPicker.styled';

interface Props {
  style?: CSSProperties;
  initialColor?: string;
  baseColor?: string;
  onColorChange: (color: string) => void;
}

export const ColorPicker = ({ style, initialColor, baseColor, onColorChange }: Props): ReactElement => {
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
      <ColorPickerWrapper style={ style } className="color-picker">
        <ColorPickerButton
          onClick={ togglePopup }
          color={ currentColor }
          baseColor={ baseColor || 'transparent' }
        />
        <ColorPickerGrid
          onColorSelect={ handleColorSelect }
          opened={ opened }
          baseColor={ baseColor || 'transparent' }
          smallTiles
          absolute
        />
      </ColorPickerWrapper>
      { opened && <Backdrop onClick={ togglePopup } /> }
    </>
  );
};

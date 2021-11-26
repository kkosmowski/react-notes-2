import { ReactElement } from 'react';
import { COLORS } from './colors.const';
import { ColorOption, ColorPickerGridWrapper } from './styles/ColorPickerGrid.styled';

interface Props {
  opened: boolean;
  baseColor: string;
  active?: string;
  smallTiles?: boolean;
  absolute?: boolean;
  onColorSelect: (color: string) => void;
}

export const ColorPickerGrid = (
  { opened, baseColor, absolute, smallTiles, active, onColorSelect }: Props
): ReactElement => (
  <ColorPickerGridWrapper opened={ opened } absolute={ absolute }>
    { COLORS.map((color) => (
      <ColorOption
        onClick={ () => onColorSelect(color) }
        color={ color }
        baseColor={ baseColor }
        smallTiles={ smallTiles }
        isActive={ active === color }
        key={ color }
      />
    )) }
  </ColorPickerGridWrapper>
);
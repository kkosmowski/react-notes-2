import { Color } from '../domain/enums/color.enum';
import { Variant } from '../domain/enums/variant.enum';

interface Props {
  color?: Color;
  variant?: Variant;
  lighter?: boolean;
  small?: boolean;
}

export const getClassName = ({ color, variant, lighter, small }: Props): string => {
  let className = 'button';

  if (color) {
    className += ` ${ color }`;
  }
  if (variant) {
    className += ` ${ variant }`;
  }
  if (lighter) {
    className += ' --lighter';
  }
  if (small) {
    className += ' --small';
  }

  return className;
}
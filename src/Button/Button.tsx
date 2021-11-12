import { MouseEvent, ReactElement, ReactNode, useEffect, useState } from 'react';
import { Color } from '../domain/enums/color.enum';
import { Variant } from '../domain/enums/variant.enum';
import { getClassName } from './get-class-name.util';

interface Props {
  onClick: (e: MouseEvent) => void;
  children: ReactNode | ReactNode[];
  color?: Color;
  variant?: Variant;
  lighter?: boolean;
  small?: boolean;
  disabled?: boolean;
  title?: string;
  testid?: string;
  id?: string;
  type?: 'button' | 'submit' | 'reset'
}

export const Button = (
  {
    onClick,
    children,
    color,
    variant,
    lighter,
    small,
    testid,
    type = 'button',
    ...props
  }: Props
): ReactElement => {
  const [className, setClassName] = useState('button');

  useEffect(() => {
    setClassName(getClassName({ color, variant, lighter, small }));
  }, [color, variant, lighter, small]);

  return (
    <button
      onClick={ onClick }
      className={ className }
      type={ type }
      data-testid={ testid }
      { ...props }
    >
      { children }
    </button>
  );
};
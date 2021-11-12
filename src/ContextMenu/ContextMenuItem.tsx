import { FC, MouseEvent, ReactElement, ReactNode } from 'react';

interface Props {
  onClick: (e: MouseEvent) => void;
  warn?: boolean;
  testid?: string;
  children: ReactNode;
}

export const ContextMenuItem: FC<Props> = ({ onClick, children, warn, testid }): ReactElement => (
  <button
    onClick={ onClick }
    className={ `button --menu-item --darker${ warn ? ' --warn' : '' }` }
    data-testid={ testid }
  >{ children }
  </button>
);

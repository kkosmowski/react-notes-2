import { FC, MouseEvent, ReactElement, ReactNode } from 'react';

interface Props {
  onClick: (e: MouseEvent) => void;
  disabled: boolean;
  warn?: boolean;
  testid?: string;
  children: ReactNode;
}

export const ContextMenuItem: FC<Props> = ({ onClick, children, warn, disabled, testid }): ReactElement => (
  <button
    onClick={ onClick }
    className={ `button --menu-item --backgrounder${ warn ? ' --warn' : '' }` }
    disabled={ disabled }
    data-testid={ testid }
  >{ children }
  </button>
);

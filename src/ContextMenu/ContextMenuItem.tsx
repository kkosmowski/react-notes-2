import { FC, MouseEvent, ReactElement, ReactNode } from 'react';

interface Props {
  onClick: (e: MouseEvent) => void;
  warn?: boolean;
  children: ReactNode;
}

export const ContextMenuItem: FC<Props> = ({ onClick, children, warn }): ReactElement => (
  <button
    onClick={ onClick }
    className={ `button --menu-item --darker${ warn ? ' --warn' : '' }` }
  >{ children }
  </button>
);

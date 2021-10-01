import { MouseEvent, ReactElement, useEffect } from 'react';
import { DialogConfig } from '../domain/interfaces/dialog-config.interface';
import { DialogContainer, DialogWrapper } from './styles/Dialog.styles';
import { Backdrop } from '../Backdrop/Backdrop';

interface Props {
  opened: boolean;
  config?: DialogConfig;
  children: ReactElement | ReactElement[];
  testid?: string;
  onClose?: () => void; // optional, backdrop close may be disabled
}

export const Dialog = ({ opened, config, testid, children, onClose }: Props): ReactElement | null => {
  const handleDialogClick = (e: MouseEvent): void => {
    e.stopPropagation();
  };

  return opened
    ? (
      <DialogWrapper onClick={ handleDialogClick } data-testid={ testid }>
        <Backdrop onClick={ onClose } />
        <DialogContainer
          width={ config?.width }
          height={ config?.height }
          flex={ config?.flex }
        >
          { children }
        </DialogContainer>
      </DialogWrapper>
    )
    : null;
};
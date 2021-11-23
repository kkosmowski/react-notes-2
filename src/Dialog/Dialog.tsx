import { MouseEvent, ReactElement, ReactNode } from 'react';
import { DialogConfig } from '../domain/interfaces/dialog-config.interface';
import { DialogContainer, DialogWrapper } from './styles/Dialog.styled';
import { Backdrop } from '../Backdrop/Backdrop';

interface Props {
  opened: boolean;
  config?: DialogConfig;
  children: ReactNode | ReactNode[];
  testid?: string;
  backdropTestid?: string;
  onClose?: () => void; // optional, backdrop close may be disabled
}

export const Dialog = (
  { opened, config, testid, backdropTestid, children, onClose }: Props
): ReactElement | null => {
  const handleDialogClick = (e: MouseEvent): void => {
    e.stopPropagation();
  };

  return opened
    ? (
      <DialogWrapper onClick={ handleDialogClick } data-testid={ testid }>
        <Backdrop onClick={ onClose } data-testid={ backdropTestid } />
        <DialogContainer
          width={ config?.width }
          height={ config?.height }
          flex={ config?.flex }
          smallerPadding={ config?.smallerPadding }
        >
          { children }
        </DialogContainer>
      </DialogWrapper>
    )
    : null;
};
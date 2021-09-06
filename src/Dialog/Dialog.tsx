import { ReactElement } from 'react';
import { DialogConfig } from '../domain/interfaces/dialog-config.interface';
import { DialogContainer, DialogWrapper } from './styles/Dialog.styles';
import { Backdrop } from '../Backdrop/Backdrop';

interface Props {
  opened: boolean;
  config?: DialogConfig;
  children: ReactElement | ReactElement[];
  onClose?: () => void; // optional, backdrop close may be disabled
}

export const Dialog = ({ opened, config, children, onClose }: Props): ReactElement | null => {
  return opened
    ? (
      <DialogWrapper>
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
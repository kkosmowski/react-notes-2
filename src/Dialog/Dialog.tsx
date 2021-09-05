import { ReactElement } from 'react';
import { DialogConfig } from '../store/interfaces/dialog-config,interface';
import { DialogBackdrop, DialogContainer } from './Dialog.styles';
import { DialogWrapper } from './Dialog.styles';
import styled from 'styled-components';

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
        <DialogBackdrop onClick={ onClose } />
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

export const DialogControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  button + button {
    margin-left: 8px;
  }
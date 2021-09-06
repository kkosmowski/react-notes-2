import styled from 'styled-components';
import { DialogConfig } from '../../domain/interfaces/dialog-config.interface';

export const DialogWrapper = styled.div`
  position: absolute;
  z-index: 200;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  animation: 0.15s forwards fadeIn ease-in-out;
`;

export const DialogContainer = styled.div<DialogConfig>`
  position: relative;
  z-index: 100;
  width: 100%;
  ${ ({ flex }) => flex ? 'display: flex; flex-direction: column;' : '' }
  height: ${ ({ height }) => height || '60%' };
  max-width: ${ ({ width }) => width || '600px' };
  max-height: 80%;
  padding: 24px;
  background-color: var(--dark300);
  border-radius: 4px;
  box-shadow: 0 0 16px var(--dark100);
`;

export const DialogControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  button + button {
    margin-left: 8px;
  }
`;
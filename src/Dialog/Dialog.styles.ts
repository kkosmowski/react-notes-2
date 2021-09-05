import styled from 'styled-components';
import { DialogConfig } from '../store/interfaces/dialog-config,interface';

export const DialogWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  animation: 0.15s forwards fadeIn ease-in-out;
`;

export const DialogBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--dark100-50);
  cursor: pointer;
`;

export const DialogContainer = styled.div<DialogConfig>`
  position: relative;
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
import styled from 'styled-components/macro';
import { transition } from '../styles/styled-components-utils/transition.mixin';
import { snackbarHidingDuration } from '../domain/consts/snackbar.const';

export const SnackbarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 48px;
  border-radius: 4px;
  background-color: var(--dark100);
  overflow: hidden;

  ${ transition('opacity', `${ snackbarHidingDuration }ms`) }
  &:not(:last-child) {
    margin-bottom: 8px;
  }

  &.--hiding {
    opacity: 0;
  }
`;

export const SnackbarContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
`;

export const SnackbarMessage = styled.p`
  padding: 8px 0;
  font-size: 16px;
`;

export const SnackbarActions = styled.div`
  display: flex;
  align-items: center;
  margin-left: 16px;

  > .button:not(:last-child) {
    margin-right: 4px;
  }
`;

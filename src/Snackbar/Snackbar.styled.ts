import styled from 'styled-components';

export const SnackbarWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 200px;
  max-width: 40%;
  min-height: 48px;
  border-radius: 4px;
  background-color: var(--dark100);
  overflow: hidden;
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

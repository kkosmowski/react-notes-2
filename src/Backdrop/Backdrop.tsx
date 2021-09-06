import styled from 'styled-components';

export const Backdrop = styled.div`
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--dark100-60);
  cursor: pointer;
`;
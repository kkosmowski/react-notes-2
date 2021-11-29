import styled from 'styled-components/macro';

export const Backdrop = styled.div<{ zIndex?: number }>`
  position: fixed;
  z-index: ${ ({ zIndex }) => zIndex || 50 };
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--backdrop-color);
  cursor: pointer;
`;
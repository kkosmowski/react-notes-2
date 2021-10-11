import styled from 'styled-components';

export const StyledContainer = styled.div`
  position: absolute;
  z-index: 200;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 200px;
  max-width: 40%;
  transition: width 0.2s;
`;
import styled from 'styled-components/macro';

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
  max-width: min(600px, 90%);
  transition: width 0.2s;
  
  @media (max-width: 600px) {
    width: 100%;
  }
`;
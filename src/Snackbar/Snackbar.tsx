import { ReactElement } from 'react';
import styled from 'styled-components';

export const Snackbar = (): ReactElement => {
  return (
    <StyledDiv>
      Hello
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--primary);
`;
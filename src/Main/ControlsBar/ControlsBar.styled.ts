import styled from 'styled-components';

export const Bar = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--dark200);
`;

export const LeftContainer = styled.div`
  flex: 1;
  padding: 8px var(--wrapper-horizontal-padding) 0;

  > .button {
    margin-right: 8px;
    margin-bottom: 8px;
  }
`;

export const RightContainer = styled.div`
  
`;
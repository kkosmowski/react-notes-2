import styled from 'styled-components/macro';

export const Wrapper = styled.div`
  padding: 32px var(--wrapper-horizontal-padding);
`;

export const Section = styled.section`
  max-width: 800px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  padding: 24px 0;
  border-top: 1px solid var(--white-11);
  
  &:not(:first-child) {
    margin-top: 64px;
  }
`;

export const Subtitle = styled.h2`
  width: 100%;
  font-size: 20px;
  color: var(--white-64);
  text-transform: uppercase;
`;

export const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  row-gap: 8px;
`;

export const RightSide = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  column-gap: 24px;
  
  > .button {
    height: 36px;
  }
`;

export const ErrorText = styled.p`
  color: var(--warn);
`;
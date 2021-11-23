import styled from 'styled-components/macro';

export const Wrapper = styled.div`
  padding: 16px 24px;
  
  @media (min-width: 600px) {
    padding: 32px var(--wrapper-horizontal-padding);
  }
`;

export const Section = styled.section`
  max-width: 800px;
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  row-gap: 16px;
  border-top: 1px solid var(--foreground-11);
  
  &:not(:first-child) {
    margin-top: 40px;
  }

  @media (min-width: 600px) {
    flex-direction: row;
    align-items: flex-start;
    row-gap: unset;
    padding-top: 24px;
    padding-bottom: 24px;

    &:not(:first-child) {
      margin-top: 64px;
    }
  }
`;

export const Subtitle = styled.h2`
  width: 100%;
  font-size: 20px;
  color: var(--foreground-64);
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
  flex-direction: column;
  row-gap: 8px;
  
  > .button,
  input {
    height: 36px;
  }
  
  @media (max-width: 599px) {
    input {
      width: 100% !important;
    }
  }

  @media (min-width: 600px) {
    flex-direction: row;
    align-items: flex-end;
    column-gap: 24px;
    row-gap: unset;
  }
`;

export const ErrorText = styled.p`
  color: var(--warn);
`;
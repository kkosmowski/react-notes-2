import { ReactElement, ReactNode } from 'react';
import styled from 'styled-components/macro';

interface Props {
  children: ReactNode;
  testid?: string;
}

export const DialogTitle = ({ children, testid }: Props): ReactElement => (
  <StyledH2 data-testid={ testid }>{ children }</StyledH2>
);

const StyledH2 = styled.h2`
  position: relative;
  margin: 0;
  font-size: 24px;
  font-weight: 300;
  color: var(--white-82);

  &::after {
    content: '';
    position: absolute;
    display: block;
    bottom: -4px;
    width: 5ch;
    height: 2px;
    background-color: var(--white-16);
  }
`;
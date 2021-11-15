import styled from 'styled-components/macro';

export const MainWrapper = styled.main`
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  background-color: var(--dark300);
  padding: 16px 0;
  color: var(--white);
  margin-left: var(--sidebar-width);
`;

export const CategoryTitle = styled.h1`
  display: inline-block;
  font-size: 36px;
  font-weight: inherit;
  margin: 0 var(--wrapper-horizontal-padding) 16px;
`;
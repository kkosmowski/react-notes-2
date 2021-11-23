import styled from 'styled-components/macro';

export const CategoriesListWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  line-height: 1;
  overflow: hidden;

  @media (max-width: 599px) {
    overflow-y: auto;
  }
`;

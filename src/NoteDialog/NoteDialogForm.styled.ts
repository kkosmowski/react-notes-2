import styled from 'styled-components';

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 24px 0;
  flex: 1;
  overflow: hidden;

  > *:not(:last-child) {
    margin-bottom: 32px;
  }
`;

export const CategoriesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  > p {
    margin-bottom: 8px;
  }
`;

export const Categories = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;

  > * {
    margin-bottom: 4px;
  }
`;
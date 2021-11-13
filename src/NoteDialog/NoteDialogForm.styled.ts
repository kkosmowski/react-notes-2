import styled from 'styled-components';

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 24px 0 8px;
  flex: 1;
  overflow: auto;

  > *:not(:last-child) {
    margin-bottom: 32px;
  }
`;

export const CategoriesWrapper = styled.div`
  display: flex;
  flex-direction: column;

  > p {
    margin-bottom: 8px;
  }
`;

export const Categories = styled.div`
  display: flex;
  flex-direction: column;

  > *:not:last-child {
    margin-bottom: 4px;
  }
`;
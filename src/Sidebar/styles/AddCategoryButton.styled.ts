import styled from 'styled-components/macro';

export const AddCategoryButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  padding-bottom: 16px;
`;

export const StyledButton = styled.button`
  margin: 0 calc((var(--sidebar-width) - var(--icon-button-size)) / 2);
  flex-shrink: 0;
`;
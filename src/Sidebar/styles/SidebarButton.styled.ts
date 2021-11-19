import styled from 'styled-components/macro';

export const SidebarButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  padding: 16px 0;
    
  & + & {
    padding-top: 0;
  }
`;

export const StyledButton = styled.button`
  margin: 0 calc((var(--sidebar-width) - var(--icon-button-size)) / 2);
  flex-shrink: 0;
`;
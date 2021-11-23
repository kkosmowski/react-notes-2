import styled from 'styled-components/macro';

export const ShortcutsList = styled.ul`
  margin: 32px 0;
  overflow: auto;
`;

export const ListItem = styled.li`
  display: flex;
  align-items: center;
  line-height: 1.3;
  padding: 14px 0;
  margin: 0 12px;

  &:not(:last-child) {
    border-bottom: 1px solid var(--foreground-7);
  }

  @media (min-width: 600px) {
    line-height: 1.4;
    padding: 16px 0;
    margin: 0 16px;
  }
`;

export const Spacer = styled.li`
  height: 64px;
`;

export const Key = styled.span`
  flex: 1.25;
  min-width: 12ch;
  padding-inline-end: 1.8ch;
  color: var(--primary);
  font-weight: 400;
  
  @media (min-width: 600px) {
    min-width: 8ch;
    padding-inline-end: 2.5ch;
    flex: 1;
  }
`;

export const Explanation = styled.span`
  flex: 3.5;
`;
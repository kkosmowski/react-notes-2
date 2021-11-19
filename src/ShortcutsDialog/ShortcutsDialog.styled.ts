import styled from 'styled-components/macro';

export const ShortcutsList = styled.ul`
  margin: 32px 0;
  overflow: auto;
`;

export const ListItem = styled.li`
  display: flex;
  align-items: center;
  line-height: 1.4;
  padding: 16px 0;
  margin: 0 16px;

  &:not(:last-child) {
    border-bottom: 1px solid var(--foreground-7);
  }
`;

export const Spacer = styled.li`
  height: 64px;
`;

export const Key = styled.span`
  flex: 1;
  min-width: 8ch;
  padding-inline-end: 3ch;
  color: var(--primary);
  font-weight: 400;
`;

export const Explanation = styled.span`
  flex: 3.5;
`;
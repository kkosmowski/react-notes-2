import styled from 'styled-components';

export const SidebarWrapper = styled.aside`
  position: relative;
  z-index: 100;
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  width: var(--sidebar-width);
  background-color: var(--dark200);
  color: #eee;
  overflow: hidden;
  transition: var(--sidebar-transition);
  will-change: width;

  &.--opened,
  &:hover {
    background-color: var(--dark100);
    width: var(--sidebar-width-opened);

    + .sidebar-backdrop {
      opacity: 1;
      pointer-events: all;
    }
  }

  + .sidebar-backdrop {
    opacity: 0;
    pointer-events: none;
    transition: var(--sidebar-backdrop-transition);
    will-change: opacity;
  }
`;
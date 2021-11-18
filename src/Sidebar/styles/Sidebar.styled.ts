import styled from 'styled-components/macro';
import { transition } from '../../styles/styled-components-utils/transition.mixin';

export const SidebarWrapper = styled.aside`
  position: absolute;
  z-index: 100;
  display: flex;
  flex-direction: column;
  width: var(--sidebar-width);
  height: 100%;
  background-color: var(--dark200);
  color: var(--white-82);
  overflow: hidden;
  cursor: pointer;

  ${ transition(['width', 'background-color'], '0.2s', '0.1s') }
  
  &.--opened,
  &.--hoverable:hover {
    background-color: var(--dark100);
    width: clamp(220px, var(--sidebar-width-opened), 300px);

    + .sidebar-backdrop {
      opacity: 1;
      pointer-events: all;
    }

    > ul {
      overflow-y: auto;
    }
  }

  + .sidebar-backdrop {
    opacity: 0;
    pointer-events: none;
    ${ transition('opacity', '0.25s') }
  }

  &.--hoverable:hover {
    transition-delay: 0.4s;

    + .sidebar-backdrop {
      transition-delay: 0.3s;
    }
  }
  
  @media (min-width: 600px) {
    &.--opened,
    &:hover {
      width: var(--sidebar-width-opened);
  }
`;
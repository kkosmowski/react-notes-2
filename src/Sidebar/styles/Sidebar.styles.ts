import styled from 'styled-components';
import { transition } from '../../styles/styled-components-utils/transition.mixin';

export const SidebarWrapper = styled.aside`
  position: relative;
  z-index: 100;
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  width: var(--sidebar-width);
  background-color: var(--dark200);
  color: var(--white-82);
  overflow: hidden;

  ${ transition(['width', 'background-color'], '0.2s', '0.1s') }
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
    ${ transition('opacity', '0.25s') }
  }
`;
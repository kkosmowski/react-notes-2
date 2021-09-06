import { ReactElement } from 'react';
import styled from 'styled-components';
import { Backdrop } from '../Backdrop/Backdrop';
import { AddCategoryButton } from './AddCategoryButton';
import { CategoriesList } from './CategoriesList';

export const Sidebar = (): ReactElement => {
  return (
    <>
      <SidebarWrapper>
        <AddCategoryButton />
        <CategoriesList />
      </SidebarWrapper>
      <Backdrop className="sidebar-backdrop" />
    </>
  );
};

const SidebarWrapper = styled.aside`
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

  &:hover {
    background-color: var(--dark100);
    width: var(--sidebar-width-opened);

    + .sidebar-backdrop {
      opacity: 1;
    }
  }

  + .sidebar-backdrop {
    opacity: 0;
    pointer-events: none;
    transition: var(--sidebar-backdrop-transition);
    will-change: opacity;
  }
`;
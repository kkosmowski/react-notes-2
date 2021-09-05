import { ReactElement } from 'react';
import styled from 'styled-components';
import { AddCategoryButton } from './AddCategoryButton';
import { CategoriesList } from './CategoriesList';

export const Sidebar = (): ReactElement => {
  return (
    <SidebarWrapper>
      <AddCategoryButton />
      <CategoriesList />
    </SidebarWrapper>
  );
};

const SidebarWrapper = styled.aside`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  width: var(--sidebar-width);
  background-color: var(--dark200);
  color: #eee;
`;
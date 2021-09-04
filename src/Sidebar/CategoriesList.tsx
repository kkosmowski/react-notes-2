import { ReactElement, useState } from 'react';
import { Folder } from '@material-ui/icons';
import styled from 'styled-components';

export const CategoriesList = (): ReactElement => {
  //@todo: temporary
  const mockedCategories: ReactElement[] = [
    <Category><Folder /></Category>,
    <Category><Folder /></Category>,
    <Category><Folder /></Category>,
    <Category><Folder /></Category>,
  ];
  const [categories, setCategories] = useState<ReactElement[]>(mockedCategories);

  return (
    <CategoriesListWrapper>
      { categories }
    </CategoriesListWrapper>
  );
};

const CategoriesListWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 16px;
  line-height: 1;
`;

const Category = styled.li`
  display: flex;
  padding: 10px 0 10px calc((var(--sidebar-width) - var(--icon-size)) / 2);
  border-bottom: 1px solid var(--white-2);

  &:first-child {
    border-top: 1px solid var(--white-2);
  }

  &:hover {
    background-color: var(--white-1);
    cursor: pointer;
  }
`;

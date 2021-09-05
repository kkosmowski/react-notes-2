import { ReactElement, useState } from 'react';
import { Folder } from '@material-ui/icons';
import styled from 'styled-components';

export const CategoriesList = (): ReactElement => {
  //@todo: temporary
  const mockedCategories: ReactElement[] = [
    <Category key="0"><Folder /></Category>,
    <Category key="1"><Folder /></Category>,
    <Category key="2"><Folder /></Category>,
    <Category key="3"><Folder /></Category>,
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
  border-bottom: 1px solid var(--white-13);

  &:first-child {
    border-top: 1px solid var(--white-13);
  }

  &:hover {
    background-color: var(--white-7);
    cursor: pointer;
  }
`;

import { ReactElement, useEffect, useState } from 'react';
import { Folder, FolderOpen } from '@material-ui/icons';
import styled from 'styled-components';
import { Category } from '../domain/interfaces/category.interface';
import { MainState } from '../store/interfaces/main-state.interface';
import { bindActionCreators, Dispatch } from 'redux';
import * as categoryActions from '../store/actions/category.actions';
import { connect } from 'react-redux';
import { EntityUid } from '../domain/types/entity-uid.type';
import { rootCategory } from '../domain/consts/root-category.const';

interface Props {
  categories: Category[];
  selectedCategory: Category;
  categoryActions: any;
}

export const CategoriesListComponent = ({ categories, selectedCategory, categoryActions }: Props): ReactElement => {
  const [categoryElements, setCategoryElements] = useState<ReactElement[]>([]);

  useEffect(() => {
    categoryActions.get();
  }, []);

  useEffect(() => {
    mapCategoriesToCategoryListItems();
  }, [categories, selectedCategory]);

  const isSelectedCategory = (categoryId: EntityUid): boolean => {
    return selectedCategory.id === categoryId;
  };

  const mapCategoriesToCategoryListItems = (): void => {
    const elements: ReactElement[] = [rootCategory, ...categories].map((category) => (
      <CategoryListItem
        onClick={ () => categoryActions.select(category) }
        key={ category.id }
      >
        { isSelectedCategory(category.id) ? <FolderOpen className="icon --selected" /> : <Folder className="icon" /> }
        <span>{ category.name }</span>
      </CategoryListItem>
    ));
    setCategoryElements(elements);
  };

  return (
    <CategoriesListWrapper>
      { categoryElements }
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

const CategoryListItem = styled.li`
  display: flex;
  align-items: center;
  white-space: nowrap;
  padding: 10px 0 10px calc((var(--sidebar-width) - var(--icon-size)) / 2);
  cursor: pointer;
  border-bottom: 1px solid var(--white-7);

  &:first-child {
    border-top: 1px solid var(--white-7);
  }

  &:hover {
    background-color: var(--white-7);
  }

  > .icon {
    margin-right: calc((var(--sidebar-width) - var(--icon-size)) / 2);

    &.--selected {
      color: var(--primary);
    }
  }
`;

const mapStateToProps = ({ category }: MainState) => ({
  categories: category.categories,
  selectedCategory: category.selectedCategory,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  categoryActions: bindActionCreators(categoryActions, dispatch),
});

export const CategoriesList = connect(mapStateToProps, mapDispatchToProps)(CategoriesListComponent);

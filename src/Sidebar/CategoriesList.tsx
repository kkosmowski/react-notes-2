import { ReactElement, useEffect, useRef, useState } from 'react';
import { Category } from '../domain/interfaces/category.interface';
import { MainState } from '../store/interfaces/main-state.interface';
import { bindActionCreators, Dispatch } from 'redux';
import * as categoryActions from '../store/actions/category.actions';
import * as uiActions from '../store/actions/ui.actions';
import { connect } from 'react-redux';
import { rootCategory } from '../domain/consts/root-category.const';
import { v4 as uuidv4 } from 'uuid';
import { CategoriesListWrapper } from './styles/CategoryList.styles';
import { CategoryListItem } from './CategoryListItem';
import { Loader } from '../Loader/Loader';
import { LoaderSize } from '../domain/enums/loader-size.enum';

interface Props {
  add: void[];
  categories: Category[];
  loading: boolean;
  selected: Category;
  edited: Category | null;
  temporary: Category | null;
  categoryActions: any;
  uiActions: any;
}

const emptyCategory: Category = {
  id: '',
  name: '',
};

export const CategoriesListComponent = (
  { add, categories, loading, selected, edited, temporary, categoryActions, uiActions }: Props
): ReactElement => {
  const initialRender = useRef<boolean>(true);
  const [categoryElements, setCategoryElements] = useState<ReactElement[]>([]);

  useEffect(() => {
    categoryActions.get();
  }, []);

  useEffect(() => {
    mapCategoriesToCategoryListItems();
  }, [categories, temporary, selected]);

  useEffect(() => {
    if (!initialRender.current) {
      const newCategory: Category = { ...emptyCategory, id: uuidv4() };
      if (!temporary) {
        categoryActions.addTemporary(newCategory);
        uiActions.openSidebar();
      }
    } else {
      initialRender.current = false;
    }
  }, [add]);

  const mapCategoriesToCategoryListItems = (): void => {
    const _categories = [rootCategory, ...categories];
    if (temporary) {
      _categories.push(temporary);
    }
    const elements: ReactElement[] = _categories.map((category: Category) => (
      <CategoryListItem
        onSelect={ handleCategorySelect }
        onSave={ handleCategorySave }
        onCancel={ handleCancel }
        data={ category }
        selected={ selected.id === category.id }
        edited={ edited?.id === category.id }
        key={ category.id }
      />
    ));
    setCategoryElements(elements);
  };

  const handleCategorySelect = (category: Category): void => {
    if (selected.id !== category.id) {
      categoryActions.select(category);
    }
  };

  const handleCategorySave = (name: string): void => {
    categoryActions.createFromTemporary({ ...edited, name });
    categoryActions.select(edited!.id);
    categoryActions.finishEditingCategory();
  };

  const handleCancel = (): void => {
    categoryActions.deleteTemporary();
  };

  return (
    <CategoriesListWrapper>
      { categoryElements }
      { loading ? <Loader size={ LoaderSize.Small } /> : null }
    </CategoriesListWrapper>
  );
};

const mapStateToProps = ({ category }: MainState) => ({
  categories: category.categories,
  loading: category.categoriesLoading,
  selected: category.selectedCategory,
  edited: category.editedCategory,
  temporary: category.temporaryCategory
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  categoryActions: bindActionCreators(categoryActions, dispatch),
  uiActions: bindActionCreators(uiActions, dispatch),
});

export const CategoriesList = connect(mapStateToProps, mapDispatchToProps)(CategoriesListComponent);

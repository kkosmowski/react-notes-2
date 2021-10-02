import { ReactElement, useEffect, useRef, useState } from 'react';
import { Category } from '../domain/interfaces/category.interface';
import { rootCategory } from '../domain/consts/root-category.const';
import { v4 as uuidv4 } from 'uuid';
import { CategoriesListWrapper } from './styles/CategoryList.styled';
import { CategoryListItem } from './CategoryListItem';
import { Loader } from '../Loader/Loader';
import { LoaderSize } from '../domain/enums/loader-size.enum';
import CategoryActions from '../store/actionCreators/category.action-creators';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCategories,
  selectCategoriesLoading,
  selectEditedCategory,
  selectSelectedCategory,
  selectTemporaryCategory
} from '../store/selectors/category.selectors';
import UiActions from '../store/actionCreators/ui.action-creators';

interface Props {
  add: void[];
}

const emptyCategory: Category = {
  id: '',
  name: '',
};

export const CategoriesList = ({ add }: Props): ReactElement => {
  const loading: boolean = useSelector(selectCategoriesLoading);
  const categories: Category[] = useSelector(selectCategories);
  const temporary: Category | null = useSelector(selectTemporaryCategory);
  const selected: Category = useSelector(selectSelectedCategory);
  const edited: Category | null = useSelector(selectEditedCategory);
  const initialRender = useRef<boolean>(true);
  const [categoryElements, setCategoryElements] = useState<ReactElement[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(CategoryActions.get());
  }, []);

  useEffect(() => {
    mapCategoriesToCategoryListItems();
  }, [categories, temporary, selected]);

  useEffect(() => {
    if (!initialRender.current) {
      const newCategory: Category = { ...emptyCategory, id: uuidv4() };
      if (!temporary) {
        dispatch(CategoryActions.createTemporary(newCategory));
        dispatch(UiActions.openSidebar());
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
        onUpdate={ handleCategoryUpdate }
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
      dispatch(CategoryActions.select(category));
    }
  };

  const handleCategorySave = (name: string): void => {
    dispatch(CategoryActions.createFromTemporary({ ...edited!, name }));
    dispatch(CategoryActions.select(edited));
    dispatch(CategoryActions.finishEditingCategory());
  };

  const handleCategoryUpdate = (changedCategory: Category): void => {
    dispatch(CategoryActions.updateCategory(changedCategory));
  };

  const handleCancel = (): void => {
    dispatch(CategoryActions.deleteTemporary());
  };

  return (
    <CategoriesListWrapper>
      { categoryElements }
      { loading ? <Loader size={ LoaderSize.Small } /> : null }
    </CategoriesListWrapper>
  );
};
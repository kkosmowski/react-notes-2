import { ReactElement, useEffect, useRef, useState } from 'react';
import { Category } from '../domain/interfaces/category.interface';
import { rootCategory } from '../domain/consts/root-category.const';
import { v4 as uuidv4 } from 'uuid';
import { CategoriesListWrapper } from './styles/CategoriesList.styled';
import { CategoryListItem } from './CategoryListItem';
import { Loader } from '../Loader/Loader';
import { LoaderSize } from '../domain/enums/loader-size.enum';
import CategoryActions from '../store/actionCreators/category.action-creators';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCategoriesLoading,
  selectEditedCategory,
  selectCurrentCategoryId,
  selectTemporaryCategory,
  selectUndeletedCategories, selectAddCategoryInProgress
} from '../store/selectors/category.selectors';
import UiActions from '../store/actionCreators/ui.action-creators';
import { ConfirmationAction } from '../domain/enums/confirmation-action.enum';
import { selectNotes } from '../store/selectors/note.selectors';
import { selectConfirmationResult } from '../store/selectors/ui.selectors';
import { EntityUid } from '../domain/types/entity-uid.type';
import { useHistory } from 'react-router-dom';
import { isRootCategory } from '../utils/is-root-category.util';
import { RouterUtil } from '../domain/utils/router.util';

const emptyCategory: Category = {
  id: '',
  name: '',
  deleted: false,
};

export const CategoriesList = (): ReactElement => {
  const loading: boolean = useSelector(selectCategoriesLoading);
  const categories: Category[] = useSelector(selectUndeletedCategories);
  const temporary: Category | null = useSelector(selectTemporaryCategory);
  const currentCategoryId = useSelector(selectCurrentCategoryId);
  const edited: Category | null = useSelector(selectEditedCategory);
  const notes = useSelector(selectNotes);
  const confirmationResult = useSelector(selectConfirmationResult);
  const addCategoryInProgress = useSelector(selectAddCategoryInProgress);
  const containsNotes = useRef<Record<EntityUid, boolean>>({});
  const initialRender = useRef<boolean>(true);
  const [categoryElements, setCategoryElements] = useState<ReactElement[]>([]);
  const categoryToRemove = useRef<Category | null>(null);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(CategoryActions.get());
  }, []);

  useEffect(() => {
    if (notes.length) {
      const record: Record<EntityUid, boolean> = {};
      notes.forEach((note) => {
        note.categories.forEach((categoryId) => {
          record[categoryId] = true;
        });
      });
      containsNotes.current = record;
    }
  }, [notes]);

  useEffect(() => {
    mapCategoriesToCategoryListItems();
  }, [categories, temporary, currentCategoryId]);

  useEffect(() => {
    if (!initialRender.current && addCategoryInProgress) {
      const newCategory: Category = { ...emptyCategory, id: uuidv4() };
      if (!temporary) {
        dispatch(CategoryActions.createTemporary(newCategory));
        dispatch(UiActions.openSidebar());
      }
    } else {
      initialRender.current = false;
    }
  }, [addCategoryInProgress]);

  useEffect(() => {
    if (confirmationResult) {
      const { action, result } = confirmationResult;

      switch (action) {
        case ConfirmationAction.DeleteCategory:
          if (categoryToRemove.current) {
            if (typeof result === 'boolean') {
              dispatch(UiActions.clearConfirmationDialogData());
              if (result) {
                deleteCategory(categoryToRemove.current);
              }
              categoryToRemove.current = null;
            }
          }
          break;
      }
    }
  }, [confirmationResult]);

  const mapCategoriesToCategoryListItems = (): void => {
    const _categories = [rootCategory, ...categories];

    if (temporary) {
      _categories.push(temporary);
    }

    const elements: ReactElement[] = _categories
      .map((category: Category) => (
        <CategoryListItem
          onSelect={ handleCategorySelect }
          onSave={ handleCategorySave }
          onUpdate={ handleCategoryUpdate }
          onCancel={ handleCancel }
          onDelete={ handleDelete }
          data={ category }
          current={ currentCategoryId === category.id }
          edited={ edited?.id === category.id }
          key={ category.id }
        />
      ));

    setCategoryElements(elements);
  };

  const handleCategorySelect = (category: Category): void => {
    if (currentCategoryId !== category.id) {
      console.log(category);
      dispatch(CategoryActions.change(category.id));

      const pathname: string = isRootCategory(category.id)
        ? '/'
        : `/category/${ category.id }`;

      RouterUtil.push(pathname, history, { dontCompareWithPrevious: true });
    }
  };

  const handleCategorySave = (name: string): void => {
    const newCategory: Category = { ...edited!, name };
    dispatch(CategoryActions.createFromTemporary(newCategory));
    handleCategorySelect(newCategory);
    dispatch(CategoryActions.finishEditingCategory());
  };

  const handleCategoryUpdate = (changedCategory: Category): void => {
    dispatch(CategoryActions.updateCategory(changedCategory));
  };

  const handleCancel = (): void => {
    dispatch(CategoryActions.deleteTemporary());
  };

  const handleDelete = (category: Category): void => {
    if (containsNotes.current[category.id]) {
      categoryToRemove.current = category;
      dispatch(UiActions.openConfirmationDialog(ConfirmationAction.DeleteCategory));
    } else {
      deleteCategory(category);
    }
  };

  const deleteCategory = (category: Category): void => {
    dispatch(CategoryActions.deleteCategory(category));

    if (category.id === currentCategoryId) {
      dispatch(CategoryActions.change(rootCategory.id));
    }
  };

  return (
    <CategoriesListWrapper>
      { categoryElements }
      { loading ? <Loader size={ LoaderSize.Small } /> : null }
    </CategoriesListWrapper>
  );
};
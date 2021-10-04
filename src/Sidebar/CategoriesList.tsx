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
import { ConfirmationDialogData } from '../domain/interfaces/confirmation-dialog-data.interface';
import { ConfirmationAction } from '../domain/enums/confirmation-action.enum';
import { selectNotes } from '../store/selectors/note.selectors';
import { selectConfirmationResult } from '../store/selectors/ui.selectors';
import { EntityUid } from '../domain/types/entity-uid.type';
import { useTranslation } from 'react-i18next';

interface Props {
  add: void[];
}

const emptyCategory: Category = {
  id: '',
  name: '',
  deleted: false,
};

export const CategoriesList = ({ add }: Props): ReactElement => {
  const loading: boolean = useSelector(selectCategoriesLoading);
  const categories: Category[] = useSelector(selectCategories);
  const temporary: Category | null = useSelector(selectTemporaryCategory);
  const selected: Category = useSelector(selectSelectedCategory);
  const edited: Category | null = useSelector(selectEditedCategory);
  const notes = useSelector(selectNotes);
  const confirmationResult = useSelector(selectConfirmationResult);
  const containsNotes = useRef<Record<EntityUid, boolean>>({});
  const initialRender = useRef<boolean>(true);
  const [categoryElements, setCategoryElements] = useState<ReactElement[]>([]);
  const dispatch = useDispatch();
  const { t } = useTranslation('CONFIRMATION');

  useEffect(() => {
    dispatch(CategoryActions.get());
  }, []);

  useEffect(() => {
    const record: Record<EntityUid, boolean> = {};

    notes.forEach((note) => {
      console.log(note, note.categories);
      note.categories.forEach((categoryId) => {
        record[categoryId] = true;
      });
    });

    containsNotes.current = record;
  }, [notes]);

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

  useEffect(() => {
    if (confirmationResult) {
      const { action, result, id } = confirmationResult;
      switch (action) {
        case ConfirmationAction.DeleteCategory:
          if (result && id) {
            deleteCategory(id);
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
      .filter((category: Category) => !category.deleted)
      .map((category: Category) => (
        <CategoryListItem
          onSelect={ handleCategorySelect }
          onSave={ handleCategorySave }
          onUpdate={ handleCategoryUpdate }
          onCancel={ handleCancel }
          onDelete={ handleDelete }
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

  const handleDelete = (category: Category): void => {
    if (containsNotes.current[category.id]) {
      const confirmationDialogData: ConfirmationDialogData = {
        title: t('TITLE.DELETE_CATEGORY'),
        message: t('MESSAGE.DELETE_CATEGORY'),
        cancelButtonText: t('CONTROLS.NO_CANCEL'),
        confirmButtonText: t('CONTROLS.YES_DELETE'),
        action: ConfirmationAction.DeleteCategory,
        id: category.id,
      };
      dispatch(UiActions.openConfirmationDialog(confirmationDialogData));
    } else {
      deleteCategory(category.id);
    }
  };

  const deleteCategory = (categoryId: EntityUid): void => {
    dispatch(CategoryActions.deleteCategory(categoryId));
  };

  return (
    <CategoriesListWrapper>
      { categoryElements }
      { loading ? <Loader size={ LoaderSize.Small } /> : null }
    </CategoriesListWrapper>
  );
};
import { ActionFunction } from '../../domain/types/action-function.type';
import { Dispatch } from 'redux';
import { Category } from '../../domain/interfaces/category.interface';
import categoryActions from '../actions/category.actions';
import { Action } from '../../domain/interfaces/action.interface';
import HistoryActions from './history.action-creators';
import NoteActions from './note.action-creators';
import { EntityUid } from '../../domain/types/entity-uid.type';
import UiActions from './ui.action-creators';
import store from '../store';
import { RootState } from '../interfaces/root-state.interface';
import { StorageService } from '../../services/storage.service';

const CategoryActions = {
  get(): ActionFunction<Promise<void>> {
    return async function (dispatch: Dispatch): Promise<void> {
      dispatch(categoryActions.getCategories());

      const categories = await StorageService.getAll<Category[]>('categories');
      dispatch(categoryActions.getCategoriesSuccess(categories));
    };
  },

  // for testing purpose only
  _getSuccess(payload: Category[]): ActionFunction<Promise<void>> {
    return async function (dispatch: Dispatch): Promise<void> {
      dispatch(categoryActions.getCategoriesSuccess(payload));
    };
  },

  createFromTemporary(category: Category): ActionFunction<Promise<void>> {
    return async function (dispatch: Dispatch): Promise<void> {
      dispatch(categoryActions.createCategory());

      const newCategory = await StorageService.add<Category>('categories', category);
      dispatch(categoryActions.createCategorySuccess(newCategory));
      HistoryActions.push(categoryActions.createCategorySuccess(newCategory))(dispatch);
    };
  },

  change(categoryId: EntityUid, initial = false): ActionFunction<void> {
    return async function (dispatch: Dispatch): Promise<void> {
      dispatch(categoryActions.changeCategory(categoryId));

      if (!initial) {
        dispatch(NoteActions.clearSelection());
        dispatch(UiActions.closeSidebar());
      }
    };
  },
  changeToIndex(index: number): ActionFunction<void> {
    return async function (dispatch: Dispatch): Promise<void> {
      const state = (store.getState() as RootState).category;

      if (state.categories.length >= index && state.currentCategoryId !== state.categories[index - 1].id) {
        dispatch(categoryActions.changeCategoryToIndex(index - 1));
      }
    };
  },

  editCategory(category: Category): Action {
    return categoryActions.editCategory(category);
  },

  revertCategoryUpdate(category: Category): ActionFunction<Promise<void>> {
    return updateOrRevert(category, 'revertCategoryUpdate');
  },

  updateCategory(category: Category): ActionFunction<Promise<void>> {
    return updateOrRevert(category, 'updateCategory');
  },

  finishEditingCategory(): Action {
    return categoryActions.editCategorySuccess();
  },

  createTemporary(category: Category): ActionFunction<void> {
    return function (dispatch: Dispatch): void {
      dispatch(categoryActions.editCategory(category));
      dispatch(categoryActions.createTemporaryCategory(category));
    };
  },

  deleteTemporary(closeSidebar = false): ActionFunction<void> {
    return function (dispatch: Dispatch): void {
      dispatch(categoryActions.deleteTemporaryCategory());
      closeSidebar && dispatch(UiActions.closeSidebar());
    };
  },

  deleteCategory(category: Category): ActionFunction<Promise<void>> {
    return deleteAndRestore(category, 'deleteCategory');
  },

  restoreCategory(category: Category): ActionFunction<Promise<void>> {
    return deleteAndRestore(category, 'restoreCategory');
  },

  addCategory(): Action {
    return categoryActions.addCategory();
  },
};

// no idea if this is incredibly genius or extremely wrong, gonna keep it, though
const deleteAndRestore = (
  category: Category,
  actionName: 'deleteCategory' | 'restoreCategory',
): ActionFunction<Promise<void>> => {
  const successAction = actionName + 'Success' as 'deleteCategorySuccess' | 'restoreCategorySuccess';

  return async function (dispatch: Dispatch): Promise<void> {
    dispatch((categoryActions[actionName])());

    const updatedCategory = await StorageService.update<Category>(
      'categories',
      { id: category.id },
      { deleted:
          actionName === 'deleteCategory'
      }
    );
    dispatch(categoryActions[successAction](updatedCategory));
    HistoryActions.push(categoryActions[successAction](updatedCategory))(dispatch);
  };
};

const updateOrRevert = (
  category: Category,
  actionName: 'updateCategory' | 'revertCategoryUpdate',
): ActionFunction<Promise<void>> => {
  const successAction = actionName + 'Success' as 'updateCategorySuccess' | 'revertCategoryUpdateSuccess';
  const originalCategory: Category = (store.getState() as RootState).category.categories.find((c) => c.id === category.id)!;

  return async function (dispatch: Dispatch): Promise<void> {
    dispatch(categoryActions[actionName]());

    const updatedCategory = await StorageService.set('categories', { id: category.id }, category);
    dispatch(categoryActions[successAction](updatedCategory));
    HistoryActions.push(categoryActions[successAction](originalCategory))(dispatch);
  };
};

export default CategoryActions;
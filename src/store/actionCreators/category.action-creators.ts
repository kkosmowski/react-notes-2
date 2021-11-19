import { ActionFunction } from '../../domain/types/action-function.type';
import { Dispatch } from 'redux';
import { HttpService } from '../../services/http.service';
import { Category } from '../../domain/interfaces/category.interface';
import categoryActions from '../actions/category.actions';
import { Action } from '../../domain/interfaces/action.interface';
import HistoryActions from './history.action-creators';
import NoteActions from './note.action-creators';
import { EntityUid } from '../../domain/types/entity-uid.type';
import UiActions from './ui.action-creators';
import store from '../store';
import { RootState } from '../interfaces/root-state.interface';

const CategoryActions = {
  get(): ActionFunction<Promise<void>> {
    return function (dispatch: Dispatch): Promise<void> {
      dispatch(categoryActions.getCategories());
      return HttpService
        .get('/categories')
        .then((categories: Category[]) => {
          dispatch(categoryActions.getCategoriesSuccess(categories));
        })
        .catch(error => {
          console.error(error);
          dispatch(categoryActions.getCategoriesFail());
        });
    };
  },

  // for testing purpose only
  _getSuccess(payload: Category[]): ActionFunction<Promise<void>> {
    return async function (dispatch: Dispatch): Promise<void> {
      dispatch(categoryActions.getCategoriesSuccess(payload));
    };
  },

  createFromTemporary(category: Category): ActionFunction<Promise<void>> {
    return function (dispatch: Dispatch): Promise<void> {
      dispatch(categoryActions.createCategory());
      return HttpService
        .post<Category>('/categories', category)
        .then(() => {
          dispatch(categoryActions.createCategorySuccess(category));
          HistoryActions.push(categoryActions.createCategorySuccess(category))(dispatch);
        })
        .catch(error => {
          console.error(error);
          dispatch(categoryActions.createCategoryFail());
        });
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

  deleteTemporary(): Action {
    return categoryActions.deleteTemporaryCategory();
  },

  deleteCategory(category: Category): ActionFunction<Promise<void>> {
    return deleteAndRestore(category, 'deleteCategory');
  },

  restoreCategory(category: Category): ActionFunction<Promise<void>> {
    return deleteAndRestore(category, 'restoreCategory');
  },
};

// no idea if this is incredibly genius or extremely wrong, gonna keep it, though
const deleteAndRestore = (
  category: Category,
  actionName: 'deleteCategory' | 'restoreCategory',
): ActionFunction<Promise<void>> => {
  const successAction = actionName + 'Success' as 'deleteCategorySuccess' | 'restoreCategorySuccess';
  const failAction = actionName + 'Fail' as 'deleteCategoryFail' | 'restoreCategoryFail';

  return function (dispatch: Dispatch): Promise<void> {
    dispatch((categoryActions[actionName])());
    return HttpService
      .patch(`/categories/${ category.id }`, { deleted: actionName === 'deleteCategory' })
      .then(() => {
        dispatch(categoryActions[successAction](category));
        HistoryActions.push(categoryActions[successAction](category))(dispatch);
      })
      .catch((error) => {
        console.error(error);
        dispatch(categoryActions[failAction]());
      });
  };
};

const updateOrRevert = (
  category: Category,
  actionName: 'updateCategory' | 'revertCategoryUpdate',
): ActionFunction<Promise<void>> => {
  const successAction = actionName + 'Success' as 'updateCategorySuccess' | 'revertCategoryUpdateSuccess';
  const failAction = actionName + 'Fail' as 'updateCategoryFail' | 'revertCategoryUpdateFail';

  const originalCategory: Category = (store.getState() as RootState).category.categories.find((c) => c.id === category.id)!;

  return function (dispatch: Dispatch): Promise<void> {
    dispatch(categoryActions[actionName]());
    return HttpService
      .put(`/categories/${ category.id }`, category)
      .then(() => {
        dispatch(categoryActions[successAction](category));
        HistoryActions.push(categoryActions[successAction](originalCategory))(dispatch);
      })
      .catch((error) => {
        console.error(error);
        dispatch(categoryActions[failAction]());
      });
  };
};

export default CategoryActions;
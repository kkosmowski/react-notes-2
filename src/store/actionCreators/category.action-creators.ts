import { ActionFunction } from '../../domain/types/action-function.type';
import { Dispatch } from 'redux';
import { HttpService } from '../../services/http.service';
import { Category } from '../../domain/interfaces/category.interface';
import categoryActions from '../actions/category.actions';
import { Action } from '../../domain/interfaces/action.interface';
import HistoryActions from './history.action-creators';
import { EntityUid } from '../../domain/types/entity-uid.type';

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
          HistoryActions.push(categoryActions.createCategorySuccess(category));
        })
        .catch(error => {
          console.error(error);
          dispatch(categoryActions.createCategoryFail());
        });
    };
  },

  select(category: Category | null): ActionFunction<void> {
    return async function (dispatch: Dispatch): Promise<void> {
      dispatch(categoryActions.selectCategory(category));
    };
  },

  editCategory(category: Category): Action {
    // @todo implement
    return categoryActions.editCategory(category);
    // @todo implement
    // HistoryActions.push(categoryActions.editCategorySuccess(category))(dispatch);
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

  removeCategory(categoryId: EntityUid): Action {
    // @todo implement
    return categoryActions.removeCategory(categoryId);
    // @todo implement
    // HistoryActions.push(categoryActions.removeCategorySuccess(categoryId))(dispatch);
  },

  restoreCategory(categoryId: EntityUid): Action {
    // @todo implement
    return categoryActions.restoreCategory(categoryId);
    // @todo implement
    // HistoryActions.push(categoryActions.restoreCategorySuccess(categoryId))(dispatch);
  },
};

export default CategoryActions;
import { ActionFunction } from '../../domain/types/action-function.type';
import { Dispatch } from 'redux';
import { HttpService } from '../../services/http.service';
import { Category } from '../../domain/interfaces/category.interface';
import categoryActions from '../actions/category.actions';
import { Action } from '../../domain/interfaces/action.interface';

export function get(): ActionFunction<Promise<void>> {
  return function (dispatch: Dispatch): Promise<void> {
    dispatch({ type: categoryActions.getCategories });
    return HttpService
      .get('/categories')
      .then((categories: Category[]) => {
        dispatch({ type: categoryActions.getCategoriesSuccess, payload: categories });
      })
      .catch(error => {
        console.error(error);
        dispatch({ type: categoryActions.getCategoriesFail });
      });
  };
}

export function createFromTemporary(category: Category): ActionFunction<Promise<void>> {
  return function (dispatch: Dispatch): Promise<void> {
    dispatch({ type: categoryActions.createCategory });
    return HttpService
      .post<Category>('/categories', category)
      .then(() => {
        dispatch({ type: categoryActions.createCategorySuccess, payload: category });
      })
      .catch(error => {
        console.error(error);
        dispatch({ type: categoryActions.createCategoryFail });
      });
  };
}

export function select(category: Category | null): Action {
  return { type: categoryActions.selectCategory, payload: category };
}

export function editCategory(category: Category): Action {
  return { type: categoryActions.editCategory, payload: category };
}
export function finishEditingCategory(): Action {
  return { type: categoryActions.editCategorySuccess };
}

export function addTemporary(category: Category): Action {
  editCategory(category);
  return { type: categoryActions.addTemporaryCategory, payload: category };
}
export function deleteTemporary(): Action {
  return { type: categoryActions.deleteTemporaryCategory };
}

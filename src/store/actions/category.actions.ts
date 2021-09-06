import { ActionFunction } from '../../domain/types/action-function.type';
import { Dispatch } from 'redux';
import { HttpService } from '../../services/http.service';
import { Category } from '../../domain/interfaces/category.interface';
import { CategoryActions } from './actions.enum';

export function get(): ActionFunction<Promise<void>> {
  return function (dispatch: Dispatch): Promise<void> {
    dispatch({ type: CategoryActions.GET_CATEGORIES });
    return HttpService
      .get('/categories')
      .then((categories: Category[]) => {
        dispatch({ type: CategoryActions.GET_CATEGORIES_SUCCESS, payload: categories });
      })
      .catch(() => {
        dispatch({ type: CategoryActions.GET_CATEGORIES_FAIL });
      });
  };
}

export function addTemporary(category: Category): ActionFunction<void> {
  return function (dispatch: Dispatch): void {
    dispatch({ type: CategoryActions.ADD_TEMPORARY_CATEGORY, payload: category });
    dispatch({ type: CategoryActions.EDIT_CATEGORY, payload: category });
  };
}

export function createFromTemporary(category: Category): ActionFunction<Promise<void>> {
  return function (dispatch: Dispatch): Promise<void> {
    dispatch({ type: CategoryActions.CREATE_CATEGORY });
    return HttpService
      .post<Category>('/categories', category)
      .then(() => {
        dispatch({ type: CategoryActions.CREATE_CATEGORY_SUCCESS, payload: category });
      })
      .catch(() => {
        dispatch({ type: CategoryActions.CREATE_CATEGORY_FAIL });
      });
  };
}

export function deleteTemporary(): ActionFunction<void> {
  return function (dispatch: Dispatch): void {
    dispatch({ type: CategoryActions.DELETE_TEMPORARY_CATEGORY });
  };
}

export function select(category: Category | null): ActionFunction<void> {
  return function (dispatch: Dispatch): void {
    dispatch({ type: CategoryActions.SELECT_CATEGORY, payload: category });
  };
}

export function editCategory(category: Category): ActionFunction<void> {
  return function (dispatch: Dispatch): void {
    dispatch({ type: CategoryActions.EDIT_CATEGORY, payload: category });
  };
}

export function finishEditingCategory(): ActionFunction<void> {
  return function (dispatch: Dispatch): void {
    dispatch({ type: CategoryActions.EDIT_CATEGORY_SUCCESS });
  };
}

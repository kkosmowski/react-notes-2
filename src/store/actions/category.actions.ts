import { ActionFunction } from '../../domain/types/action-function.type';
import { Dispatch } from 'redux';
import { HttpService } from '../../services/http.service';
import { Category } from '../../domain/interfaces/category.interface';
import { CategoryActions } from './actions.enum';
import { EntityUid } from '../../domain/types/entity-uid.type';

export function get(): ActionFunction<Promise<void>> {
  return function(dispatch: Dispatch): Promise<void> {
    dispatch({ type: CategoryActions.GET_CATEGORIES });
    return HttpService
      .get('/categories')
      .then((categories: Category[]) => {
        dispatch({ type: CategoryActions.GET_CATEGORIES_SUCCESS, payload: categories });
      })
      .catch(() => {
        dispatch({ type: CategoryActions.GET_CATEGORIES_FAIL });
      });
  }
}

export function add(): ActionFunction<void> {
  return function(dispatch: Dispatch): void {
    dispatch({ type: CategoryActions.ADD_CATEGORY });
  };
}

export function create(category: Category): ActionFunction<Promise<void>> {
  return function(dispatch: Dispatch): Promise<void> {
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

export function select(category: Category | null): ActionFunction<void> {
  return function(dispatch: Dispatch): void {
    dispatch({ type: CategoryActions.SELECT_CATEGORY, payload: category });
  };
}

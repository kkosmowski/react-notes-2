import { ActionFunction } from '../../domain/types/action-function.type';
import { Dispatch } from 'redux';
import { HttpService } from '../../services/http.service';
import { Category } from '../../domain/interfaces/category.interface';
import { CategoryActions } from './actions.enum';
import { EntityUid } from '../../domain/types/entity-uid.type';
import store from '../store';

export function get(): ActionFunction<Promise<void>> {
  return function (dispatch: Dispatch): Promise<void> {
    dispatch({ type: CategoryActions.GET_CATEGORIES });
    return HttpService
      .get('/categories')
      .then((categories: Category[]) => {
        dispatch({ type: CategoryActions.GET_CATEGORIES_SUCCESS, payload: categories });
      })
      .catch(error => {
        console.error(error);
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
      .catch(error => {
        console.error(error);
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

export function addNoteToCategories(categoryIds: EntityUid[], noteId: EntityUid): ActionFunction<void> {
  return function (dispatch: Dispatch): void {
    dispatch({ type: CategoryActions.UPDATE_CATEGORIES_STARTED });

    const categories: Category[] = [...store.getState().category.categories];
    const promises: Promise<void>[] = [];
    for (let categoryId of categoryIds) { // unfortunately no better approach possible with json-server
      const currentCategory: Category = categories.find((category) => category.id === categoryId)!;
      currentCategory.notes
        ? currentCategory.notes.push(noteId)
        : currentCategory.notes = [noteId];
      promises.push(HttpService.put<Category>(
        `/categories/${ categoryId }`,
        currentCategory
      ).then(() => {
        dispatch({ type: CategoryActions.UPDATE_CATEGORY_SUCCESS, payload: currentCategory });
      }).catch(error => {
        console.error(error);
      }));
    }

    Promise
      .all(promises)
      .then(() => {
        dispatch({ type: CategoryActions.UPDATE_CATEGORIES_FINISHED });
      })
      .catch(error => {
        console.error(error);
      });
  };
}
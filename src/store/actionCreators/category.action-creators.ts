import { ActionFunction } from '../../domain/types/action-function.type';
import { Dispatch } from 'redux';
import { HttpService } from '../../services/http.service';
import { Category } from '../../domain/interfaces/category.interface';
import categoryActions from '../actions/category.actions';
import { Action } from '../../domain/interfaces/action.interface';
import HistoryActions from './history.action-creators';
import NoteActions from './note.action-creators';
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
          HistoryActions.push(categoryActions.createCategorySuccess(category))(dispatch);
        })
        .catch(error => {
          console.error(error);
          dispatch(categoryActions.createCategoryFail());
        });
    };
  },

  change(categoryId: EntityUid): ActionFunction<void> {
    return async function (dispatch: Dispatch): Promise<void> {
      dispatch(categoryActions.changeCategory(categoryId));
      dispatch(NoteActions.clearSelection());
    };
  },

  editCategory(category: Category): Action {
    // @todo implement
    return categoryActions.editCategory(category);
    // @todo implement
    // HistoryActions.push(categoryActions.editCategorySuccess(category))(dispatch);
  },

  updateCategory(category: Category): ActionFunction<Promise<void>> {
    return function (dispatch: Dispatch): Promise<void> {
      dispatch(categoryActions.updateCategory());
      return HttpService
        .put(`/categories/${ category.id }`, category)
        .then(() => {
          dispatch(categoryActions.updateCategorySuccess(category));
        })
        .catch((error) => {
          console.error(error);
          dispatch(categoryActions.updateCategoryFail());
        });
    };
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
    return deleteAndRestore('deleteCategory', category);
  },

  restoreCategory(category: Category): ActionFunction<Promise<void>> {
    return deleteAndRestore('restoreCategory', category);
  },
};

// no idea if this is incredibly genius or extremely wrong, gonna keep it, though
const deleteAndRestore = (actionName: 'deleteCategory' | 'restoreCategory', category: Category): ActionFunction<Promise<void>> => {
  const success = actionName + 'Success' as 'deleteCategorySuccess' | 'restoreCategorySuccess';
  const fail = actionName + 'Fail' as 'deleteCategoryFail' | 'restoreCategoryFail';
  return function (dispatch: Dispatch): Promise<void> {
    dispatch((categoryActions[actionName])());
    return HttpService
      .patch(`/categories/${ category.id }`, { deleted: actionName === 'deleteCategory' })
      .then(() => {
        dispatch(categoryActions[success](category));
        HistoryActions.push(categoryActions[success](category))(dispatch);
      })
      .catch((error) => {
        console.error(error);
        dispatch(categoryActions[fail]());
      });
  };
};

export default CategoryActions;
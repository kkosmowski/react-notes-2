import { ActionFunction } from '../../domain/types/action-function.type';
import { Dispatch } from 'redux';
import { HttpService } from '../../services/http.service';
import { Category } from '../../domain/interfaces/category.interface';
import categoryActions from '../actions/category.actions';

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

  createFromTemporary(category: Category): ActionFunction<Promise<void>> {
    return function (dispatch: Dispatch): Promise<void> {
      dispatch(categoryActions.createCategory());
      return HttpService
        .post<Category>('/categories', category)
        .then(() => {
          dispatch(categoryActions.createCategorySuccess(category));
        })
        .catch(error => {
          console.error(error);
          dispatch(categoryActions.createCategoryFail());
        });
    };
  },

  select(category: Category | null): any {
    return categoryActions.selectCategory(category);
  },

  editCategory(category: Category): any {
    return categoryActions.editCategory(category);
  },

  finishEditingCategory(): any {
    return categoryActions.editCategorySuccess();
  },

  createTemporary(category: Category): ActionFunction<void> {
    return function (dispatch: Dispatch): void {
      dispatch(categoryActions.editCategory(category));
      dispatch(categoryActions.createTemporaryCategory(category));
    };
  },

  deleteTemporary(): any {
    return categoryActions.deleteTemporaryCategory();
  },
};

export default CategoryActions;
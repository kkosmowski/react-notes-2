import { createAction } from '@reduxjs/toolkit';
import { Category } from '../../domain/interfaces/category.interface';
import { EntityUid } from '../../domain/types/entity-uid.type';

const categoryActions = {
  getCategories: createAction<void>('GET_CATEGORIES'),
  getCategoriesSuccess: createAction<Category[]>('GET_CATEGORIES_SUCCESS'),
  getCategoriesFail: createAction<void>('GET_CATEGORIES_FAIL'),

  createTemporaryCategory: createAction<Category>('CREATE_TEMPORARY_CATEGORY'),
  deleteTemporaryCategory: createAction<void>('DELETE_TEMPORARY_CATEGORY'),

  createCategory: createAction<void>('CREATE_CATEGORY'),
  createCategorySuccess: createAction<Category>('CREATE_CATEGORY_SUCCESS'),
  createCategoryFail: createAction<void>('CREATE_CATEGORY_FAIL'),

  selectCategory: createAction<Category | null>('SELECT_CATEGORY'),

  editCategory: createAction<Category>('EDIT_CATEGORY'),
  editCategorySuccess: createAction<void>('EDIT_CATEGORY_SUCCESS'),

  removeCategory: createAction<EntityUid>('REMOVE_CATEGORY'),
  removeCategorySuccess: createAction<void>('REMOVE_CATEGORY_SUCCESS'),
  removeCategoryFail: createAction<void>('REMOVE_CATEGORY_FAIL'),

  restoreCategory: createAction<EntityUid>('RESTORE_CATEGORY'),
  restoreCategorySuccess: createAction<void>('RESTORE_CATEGORY_SUCCESS'),
  restoreCategoryFail: createAction<void>('RESTORE_CATEGORY_FAIL'),

  updateCategory: createAction<void>('UPDATE_CATEGORY'),
  updateCategorySuccess: createAction<Category>('UPDATE_CATEGORY_SUCCESS'),
  updateCategoryFail: createAction<void>('UPDATE_CATEGORY_FAIL'),
};

export default categoryActions;
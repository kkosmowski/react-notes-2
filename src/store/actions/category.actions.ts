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

  changeCategory: createAction<EntityUid>('CHANGE_CATEGORY'),
  changeCategoryToIndex: createAction<number>('CHANGE_CATEGORY_TO_INDEX'),

  editCategory: createAction<Category>('EDIT_CATEGORY'),
  editCategorySuccess: createAction<void>('EDIT_CATEGORY_SUCCESS'),

  deleteCategory: createAction<void>('DELETE_CATEGORY'),
  deleteCategorySuccess: createAction<Category>('DELETE_CATEGORY_SUCCESS'),
  deleteCategoryFail: createAction<void>('DELETE_CATEGORY_FAIL'),

  restoreCategory: createAction<void>('RESTORE_CATEGORY'),
  restoreCategorySuccess: createAction<Category>('RESTORE_CATEGORY_SUCCESS'),
  restoreCategoryFail: createAction<void>('RESTORE_CATEGORY_FAIL'),

  updateCategory: createAction<void>('UPDATE_CATEGORY'),
  updateCategorySuccess: createAction<Category>('UPDATE_CATEGORY_SUCCESS'),
  updateCategoryFail: createAction<void>('UPDATE_CATEGORY_FAIL'),

  revertCategoryUpdate: createAction<void>('REVERT_CATEGORY_UPDATE'),
  revertCategoryUpdateSuccess: createAction<Category>('REVERT_CATEGORY_UPDATE_SUCCESS'),
  revertCategoryUpdateFail: createAction<void>('REVERT_CATEGORY_UPDATE_FAIL'),

  addCategory: createAction<void>('ADD_CATEGORY'),
};

export default categoryActions;
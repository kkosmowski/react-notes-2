import { createAction } from '@reduxjs/toolkit';
import { Category } from '../../domain/interfaces/category.interface';
import { EntityUid } from '../../domain/types/entity-uid.type';

const categoryActions = {
  getCategories: createAction<void>('GET_CATEGORIES'),
  getCategoriesSuccess: createAction<Category[]>('GET_CATEGORIES_SUCCESS'),

  createTemporaryCategory: createAction<Category>('CREATE_TEMPORARY_CATEGORY'),
  deleteTemporaryCategory: createAction<void>('DELETE_TEMPORARY_CATEGORY'),

  createCategory: createAction<void>('CREATE_CATEGORY'),
  createCategorySuccess: createAction<Category>('CREATE_CATEGORY_SUCCESS'),

  changeCategory: createAction<EntityUid>('CHANGE_CATEGORY'),
  clearCurrent: createAction<void>('CLEAR_CURRENT_CATEGORY'),
  changeCategoryToIndex: createAction<number>('CHANGE_CATEGORY_TO_INDEX'),

  editCategory: createAction<Category>('EDIT_CATEGORY'),
  editCategorySuccess: createAction<void>('EDIT_CATEGORY_SUCCESS'),

  deleteCategory: createAction<void>('DELETE_CATEGORY'),
  deleteCategorySuccess: createAction<Category>('DELETE_CATEGORY_SUCCESS'),

  restoreCategory: createAction<void>('RESTORE_CATEGORY'),
  restoreCategorySuccess: createAction<Category>('RESTORE_CATEGORY_SUCCESS'),

  updateCategory: createAction<void>('UPDATE_CATEGORY'),
  updateCategorySuccess: createAction<Category>('UPDATE_CATEGORY_SUCCESS'),

  revertCategoryUpdate: createAction<void>('REVERT_CATEGORY_UPDATE'),
  revertCategoryUpdateSuccess: createAction<Category>('REVERT_CATEGORY_UPDATE_SUCCESS'),

  addCategory: createAction<void>('ADD_CATEGORY'),
};

export default categoryActions;
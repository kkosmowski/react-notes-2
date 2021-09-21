import { createAction } from '@reduxjs/toolkit';

const categoryActions = {
  getCategories: createAction('category/getCategories'),
  getCategoriesSuccess: createAction('category/getCategoriesSuccess'),
  getCategoriesFail: createAction('category/getCategoriesFail'),

  addTemporaryCategory: createAction('category/addTemporaryCategory'),
  deleteTemporaryCategory: createAction('category/deleteTemporaryCategory'),

  createCategory: createAction('category/createCategory'),
  createCategorySuccess: createAction('category/createCategorySuccess'),
  createCategoryFail: createAction('category/createCategoryFail'),

  selectCategory: createAction('category/selectCategory'),

  editCategory: createAction('category/editCategory'),
  editCategorySuccess: createAction('category/editCategorySuccess'),
};

export default categoryActions;
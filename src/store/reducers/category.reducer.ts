import { CategoryState } from '../interfaces/category-state.interface';
import { rootCategory } from '../../domain/consts/root-category.const';
import { createReducer } from '@reduxjs/toolkit';
import categoryActions from '../actions/category.actions';

export const initialCategoryState: CategoryState = {
  categories: [],
  categoryCreationInProgress: false,
  categoriesLoading: false,
  currentCategoryId: rootCategory.id,
  editedCategory: null,
  temporaryCategory: null,
  categoryUpdateInProgress: false,
  categoryDeletionInProgress: false,
  categoryRestorationInProgress: false,
  categoryUpdateRevertInProgress: false,
  addCategoryInProgress: false,
};

const categoryReducer = createReducer(initialCategoryState, (builder) => {
  builder
    .addCase(categoryActions.getCategories, (state) => {
      state.categoriesLoading = true;
    })
    .addCase(categoryActions.getCategoriesSuccess, (state, action) => {
      if (action.payload) {
        state.categories = action.payload;
      }
      state.categoriesLoading = false;
    })

    .addCase(categoryActions.createTemporaryCategory, (state, action) => {
      state.temporaryCategory = action.payload || null;
    })
    .addCase(categoryActions.deleteTemporaryCategory, (state) => {
      state.temporaryCategory = null;
      state.addCategoryInProgress = false;
    })

    .addCase(categoryActions.createCategory, (state) => {
      state.categoryCreationInProgress = true;
    })
    .addCase(categoryActions.createCategorySuccess, (state, action) => {
      state.temporaryCategory = null;
      if (action.payload) {
        state.categories = [...state.categories, action.payload];
      }
      state.categoryCreationInProgress = false;
    })

    .addCase(categoryActions.changeCategory, (state, { payload }) => {
      state.currentCategoryId = payload;
    })
    .addCase(categoryActions.clearCurrent, (state) => {
      state.currentCategoryId = null;
    })
    .addCase(categoryActions.changeCategoryToIndex, (state, { payload }) => {
      state.currentCategoryId = state.categories[payload].id;
    })

    .addCase(categoryActions.editCategory, (state, action) => {
      state.editedCategory = action.payload || null;
    })
    .addCase(categoryActions.editCategorySuccess, (state) => {
      state.editedCategory = null;
    })

    .addCase(categoryActions.updateCategory, (state) => {
      state.categoryUpdateInProgress = true;
    })
    .addCase(categoryActions.updateCategorySuccess, (state, { payload }) => {
      state.categories = state.categories.map((category) => category.id === payload.id
        ? payload
        : category
      );
      state.categoryUpdateInProgress = false;
    })

    .addCase(categoryActions.revertCategoryUpdate, (state) => {
      state.categoryUpdateRevertInProgress = true;
    })
    .addCase(categoryActions.revertCategoryUpdateSuccess, (state, { payload }) => {
      state.categories = state.categories.map((category) => category.id === payload.id
        ? payload
        : category
      );
      state.categoryUpdateRevertInProgress = false;
    })

    .addCase(categoryActions.deleteCategory, (state) => {
      state.categoryDeletionInProgress = true;
    })
    .addCase(categoryActions.deleteCategorySuccess, (state, { payload }) => {
      state.categories = state.categories.map((category) => category.id === payload.id
        ? { ...category, deleted: true }
        : category
      );
      state.categoryDeletionInProgress = false;
    })

    .addCase(categoryActions.restoreCategory, (state) => {
      state.categoryRestorationInProgress = true;
    })
    .addCase(categoryActions.restoreCategorySuccess, (state, { payload }) => {
      state.categories = state.categories.map((category) => category.id === payload.id
        ? { ...category, deleted: false }
        : category
      );
      state.categoryRestorationInProgress = false;
    })

    .addCase(categoryActions.addCategory, (state) => {
      state.addCategoryInProgress = true;
    })
  ;
});

export default categoryReducer;

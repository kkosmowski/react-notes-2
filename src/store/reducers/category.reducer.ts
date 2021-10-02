import { CategoryState } from '../interfaces/category-state.interface';
import { rootCategory } from '../../domain/consts/root-category.const';
import { createReducer } from '@reduxjs/toolkit';
import categoryActions from '../actions/category.actions';

export const initialCategoryState: CategoryState = {
  categories: [],
  categoryCreationInProgress: false,
  categoriesLoading: false,
  selectedCategory: rootCategory,
  editedCategory: null,
  temporaryCategory: null,
  categoryUpdating: false,
};

const categoryReducer = createReducer(initialCategoryState, (builder) => {
  builder
    .addCase(categoryActions.getCategories, (state) => {
      state.categoriesLoading = true;
    })
    .addCase(categoryActions.getCategoriesSuccess, (state, action) => {
      state.categoriesLoading = false;
      if (action.payload) {
        state.categories = action.payload;
      }
    })
    .addCase(categoryActions.getCategoriesFail, (state) => {
      state.categoriesLoading = false;
    })

    .addCase(categoryActions.createTemporaryCategory, (state, action) => {
      state.temporaryCategory = action.payload || null;
    })
    .addCase(categoryActions.deleteTemporaryCategory, (state) => {
      state.temporaryCategory = null;
    })

    .addCase(categoryActions.createCategory, (state) => {
      state.categoryCreationInProgress = true;
    })
    .addCase(categoryActions.createCategorySuccess, (state, action) => {
      state.categoryCreationInProgress = false;
      state.temporaryCategory = null;
      if (action.payload) {
        state.categories = [...state.categories, action.payload];
      }
    })
    .addCase(categoryActions.createCategoryFail, (state) => {
      state.categoryCreationInProgress = false;
    })

    .addCase(categoryActions.selectCategory, (state, action) => {
      if (action.payload) {
        state.selectedCategory = action.payload;
      }
    })

    .addCase(categoryActions.editCategory, (state, action) => {
      state.editedCategory = action.payload || null;
    })
    .addCase(categoryActions.editCategorySuccess, (state) => {
      state.editedCategory = null;
    })

    .addCase(categoryActions.updateCategory, (state) => {
      state.categoryUpdating = true;
    })
    .addCase(categoryActions.updateCategorySuccess, (state, { payload }) => {
      state.categoryUpdating = false;
      state.categories = state.categories.map((category) => category.id === payload.id
        ? payload
        : category
      );
      if (state.selectedCategory.id === payload.id) {
        state.selectedCategory = payload;
      }
    })
    .addCase(categoryActions.updateCategoryFail, (state) => {
      state.categoryUpdating = false;
    });
});

export default categoryReducer;

import { CategoryState } from '../interfaces/category-state.interface';
import { rootCategory } from '../../domain/consts/root-category.const';
import { createReducer } from '@reduxjs/toolkit';
import categoryActions from '../actions/category.actions';

export const initialCategoryState: CategoryState = {
  categories: [
    {
      "id": "eb88879e-a5ed-4aa1-8eeb-49e7268b62dd",
      "name": "Test cat",
      "deleted": false
    },
    {
      "id": "18cb4c96-1f0f-4eac-b57a-06837321ee0c",
      "name": "Category 2",
      "deleted": false
    },
    {
      "id": "24e0ecb2-f0ee-49cd-ba0d-e1c6be2968ba",
      "name": "Cześć wszystkim, witam serdecznie",
      "deleted": false
    },
    {
      "id": "56875b71-69ec-4ba3-840e-5fd46e1443bf",
      "name": "asdasdad",
      "deleted": false
    },
    {
      "id": "24e0ecb3-f0ee-49cd-ba0d-e1c6be2968ba",
      "name": "Cześć wszystkim, witam serdecznie",
      "deleted": false
    },
    {
      "id": "56875b75-69ec-4ba3-840e-5fd46e1443bf",
      "name": "asdasdad",
      "deleted": false
    }
  ],
  categoryCreationInProgress: false,
  categoriesLoading: false,
  currentCategoryId: rootCategory.id,
  editedCategory: null,
  temporaryCategory: null,
  categoryUpdateInProgress: false,
  categoryDeletionInProgress: false,
  categoryRestorationInProgress: false,
};

const categoryReducer = createReducer(initialCategoryState, (builder) => {
  builder
    .addCase(categoryActions.getCategories, (state) => {
      state.categoriesLoading = true;
    })
    .addCase(categoryActions.getCategoriesSuccess, (state, action) => {
      if (action.payload) {
        // state.categories = action.payload;
      }
      state.categoriesLoading = false;
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
      state.temporaryCategory = null;
      if (action.payload) {
        state.categories = [...state.categories, action.payload];
      }
      state.categoryCreationInProgress = false;
    })
    .addCase(categoryActions.createCategoryFail, (state) => {
      state.categoryCreationInProgress = false;
    })

    .addCase(categoryActions.changeCategory, (state, action) => {
      if (action.payload) {
        state.currentCategoryId = action.payload;
      }
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
      if (state.currentCategoryId === payload.id) {
        state.currentCategoryId = payload.id;
      }
      state.categoryUpdateInProgress = false;
    })
    .addCase(categoryActions.updateCategoryFail, (state) => {
      state.categoryUpdateInProgress = false;
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
    .addCase(categoryActions.deleteCategoryFail, (state) => {
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
    .addCase(categoryActions.restoreCategoryFail, (state) => {
      state.categoryRestorationInProgress = false;
    });
});

export default categoryReducer;

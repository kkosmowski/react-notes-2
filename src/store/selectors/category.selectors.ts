import { createSelector } from 'reselect';
import { RootState } from '../interfaces/root-state.interface';
import { CategoryState } from '../interfaces/category-state.interface';

const categorySelector = (state: RootState) => state.category;

export const selectCategories = createSelector(
  categorySelector, (category: CategoryState) => category.categories
);
export const selectCategoriesLoading = createSelector(
  categorySelector, (category: CategoryState) => category.categoriesLoading
);

export const selectSelectedCategory = createSelector(
  categorySelector, (category: CategoryState) => category.selectedCategory
);

export const selectEditedCategory = createSelector(
  categorySelector, (category: CategoryState) => category.editedCategory
);

export const selectTemporaryCategory = createSelector(
  categorySelector, (category: CategoryState) => category.temporaryCategory
);
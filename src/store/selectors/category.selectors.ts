import { createSelector } from 'reselect';
import { RootState } from '../interfaces/root-state.interface';
import { CategoryState } from '../interfaces/category-state.interface';

const selector = (state: RootState) => state.category;

export const selectCategories = createSelector(
  selector, (category: CategoryState) => category.categories
);

export const selectSelectedCategory = createSelector(
  selector, (category: CategoryState) => category.selectedCategory
);
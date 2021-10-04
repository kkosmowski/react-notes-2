import { Category } from '../../domain/interfaces/category.interface';

export interface CategoryState {
  categories: Category[];
  categoryCreationInProgress: boolean;
  categoriesLoading: boolean;
  selectedCategory: Category;
  editedCategory: Category | null;
  temporaryCategory: Category | null;
  categoryUpdateInProgress: boolean;
  categoryDeletionInProgress: boolean;
  categoryRestorationInProgress: boolean;
}
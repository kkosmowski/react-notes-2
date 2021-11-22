import { Category } from '../../domain/interfaces/category.interface';
import { EntityUid } from '../../domain/types/entity-uid.type';

export interface CategoryState {
  categories: Category[];
  categoryCreationInProgress: boolean;
  categoriesLoading: boolean;
  currentCategoryId: EntityUid;
  editedCategory: Category | null;
  temporaryCategory: Category | null;
  categoryUpdateInProgress: boolean;
  categoryDeletionInProgress: boolean;
  categoryRestorationInProgress: boolean;
  categoryUpdateRevertInProgress: boolean;
  addCategoryInProgress: boolean;
}
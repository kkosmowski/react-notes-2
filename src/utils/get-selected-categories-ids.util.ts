import { SelectedCategories } from '../domain/types/selected-categories.type';
import { EntityUid } from '../domain/types/entity-uid.type';

export const getSelectedCategoriesIds = (selectedCategories: SelectedCategories): EntityUid[] => {
  return Object.entries(selectedCategories)
    .filter(([ id, isSelected ]: [EntityUid, boolean]) => isSelected)
    .map(([id, isSelected]: [EntityUid, boolean]) => id);
}
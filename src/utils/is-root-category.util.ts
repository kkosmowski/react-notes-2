import { EntityUid } from '../domain/types/entity-uid.type';
import { rootCategory } from '../domain/consts/root-category.const';

export const isRootCategory = (categoryId: EntityUid | null): boolean => categoryId === rootCategory.id;

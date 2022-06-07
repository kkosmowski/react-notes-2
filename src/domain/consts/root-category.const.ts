import { Category } from '../interfaces/category.interface';
import { NIL } from 'uuid';
import i18next from 'i18next';
import { i18nConfig } from '../../i18n';

i18next.init(i18nConfig); // @todo find out why is this necessary for tests to pass

export const rootCategory: Category = {
  id: NIL,
  name: 'COMMON.ROOT_CATEGORY',
  deleted: false,
};
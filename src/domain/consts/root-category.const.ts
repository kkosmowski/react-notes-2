import { Category } from '../interfaces/category.interface';
import { NIL } from 'uuid';
import i18next from 'i18next';
import { i18nConfig } from '../../i18n';

i18next.init(i18nConfig);

export let rootCategory: Category = {
  id: NIL,
  name: i18next.t('COMMON:ROOT_CATEGORY')
};
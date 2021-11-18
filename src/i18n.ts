import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { locales } from './i18n/locales';

export const i18nConfig = {
  lng: 'en',
  resources: locales,
  interpolation: {
    escapeValue: false,
  },
};

i18next.use(initReactI18next).init(i18nConfig);

export default i18next;
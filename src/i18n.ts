import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import enUS from './i18n/en-US.json';
import plPL from './i18n/pl-PL.json';

const resources = {
  'en': {
    translation: enUS,
  },
  'pl': {
    translation: plPL,
  },
};

export const i18nConfig = {
  lng: 'en',
  resources,
  interpolation: {
    escapeValue: false,
  },
};

i18next.use(initReactI18next).init(i18nConfig);

export default i18next;
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import transitionsEn from './translations/en.json';
import transitionsEs from './translations/es.json';

const resources = {
  en: {
    translation: transitionsEn,
  },
  es: {
    translation: transitionsEs,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      lookupCookie: 'lang',
    },
    fallbackLng: 'en', // use en if detected lng is not available
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    debug: true,
  });

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enGB from './locales/en-GB.json';
import sqAL from './locales/sq-AL.json';

export const supportedLanguages = ['en-GB', 'sq-AL'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

const resources: Record<SupportedLanguage, { translation: any }> = {
  'en-GB': {
    translation: enGB,
  },
  'sq-AL': {
    translation: sqAL,
  },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources,
  lng: 'en-GB',
  fallbackLng: 'en-GB',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

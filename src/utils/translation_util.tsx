import { useContext } from 'react';
import { TranslationContext } from '@/contexts/appLangContext';
import Translations from '@/utils/translations.json';

interface TranslationContent {
  [key: string]: string | TranslationContent;
}

interface TranslationsType {
  [key: string]: TranslationContent;
}

export default function useTrans() {
  const { language_code: language } = useContext(TranslationContext);

  return (text: string): string => {
    const currentLangTranslations: TranslationContent =
      (Translations as TranslationsType)[language] || {};
    return (currentLangTranslations[text] || text) as string;
  };
}

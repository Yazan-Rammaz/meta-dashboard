import { useContext } from 'react';
import { TranslationContext } from '@/contexts/translationContext';

interface TranslationBase {
  language_code?: string;
}

interface TranslationValue {
  [key: string]: string | number | undefined;
}

export interface TranslationData {
  [key: string]: TranslationValue;
}

export interface ShowTransProps {
  Translations: TranslationData;
  field_name: string;
}

export const transformTranslations = <T extends TranslationBase>(
  translations: T[]
): TranslationData => {
  return translations.reduce((acc, curr) => {
    if (curr.language_code) {
      const { language_code, ...rest } = curr;
      acc[language_code] = rest as TranslationValue;
    }
    return acc;
  }, {} as TranslationData);
};

export default function ShowTrans({
  Translations,
  field_name
}: ShowTransProps) {
  const { language_code } = useContext(TranslationContext);

  const isFieldTranslated = (lang: string) => {
    const field = Translations[lang]?.[field_name];
    return field && field !== '';
  };

  if (isFieldTranslated(language_code)) {
    return Translations[language_code][field_name];
  } else if (isFieldTranslated('en')) {
    return Translations.en[field_name];
  } else if (isFieldTranslated('ar')) {
    return Translations.ar[field_name];
  } else if (isFieldTranslated('tr')) {
    return Translations.tr[field_name];
  } else {
    return String(field_name); // Fallback to field_name if no translation found
  }
}

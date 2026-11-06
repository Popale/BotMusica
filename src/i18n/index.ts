import { SupportedLanguage } from '../database/types.js';
import { en } from './locales/en.js';
import { es, TranslationSchema } from './locales/es.js';
import { pt } from './locales/pt.js';

const locales: Record<SupportedLanguage, TranslationSchema> = { es, en, pt };

type PathImpl<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, unknown>
    ? `${K}.${PathImpl<T[K], keyof T[K]> & string}`
    : K
  : never;

export type I18nKey = PathImpl<TranslationSchema, keyof TranslationSchema>;

export function getTranslation(
  lang: SupportedLanguage = 'es',
  key: string,
  params?: Record<string, string | number>
): string {
  const dictionary = locales[lang] || locales.es;
  const parts = key.split('.');
  let current: unknown = dictionary;

  for (const part of parts) {
    if (typeof current === 'object' && current !== null && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      current = undefined;
      break;
    }
  }

  let text = typeof current === 'string' ? current : key;

  if (params) {
    for (const [paramKey, paramValue] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue));
    }
  }

  return text;
}


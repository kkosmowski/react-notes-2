import { Theme } from '../domain/enums/theme.enum';
import { directions, languages, themes } from '../domain/consts/settings.consts';
import { Language } from '../domain/enums/language.enum';
import { Direction } from '../domain/types/direction.type';

export const getThemeLabel = (value: Theme): string =>
  themes.find((theme) => theme.value === value)?.label || '';

export const getDirectionLabel = (value: Direction): string =>
  directions.find((direction) => direction.value === value)?.label || '';

export const getLanguageLabel = (value: Language): string =>
  languages.find((language) => language.value === value)?.label || '';
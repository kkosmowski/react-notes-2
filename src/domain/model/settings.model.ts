import { Direction } from '../types/direction.type';
import { Theme } from '../enums/theme.enum';
import { Language } from '../enums/language.enum';

export interface SettingsInterface {
  theme: Theme;
  direction: Direction;
  language: Language;
  snackbarDuration: number;
}

export type SettingsModel = [
  ThemeSetting,
  DirectionSetting,
  LanguageSetting,
  SnackbarDurationSetting,
];

export type ThemeSetting = { id: 'theme', theme: Theme };
export type DirectionSetting = { id: 'direction', direction: Direction };
export type LanguageSetting = { id: 'language', language: Language };
export type SnackbarDurationSetting = { id: 'snackbarDuration', snackbarDuration: number };
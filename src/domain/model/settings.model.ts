import { Direction } from '../types/direction.type';
import { Theme } from '../enums/theme.enum';
import { Language } from '../enums/language.enum';

export interface SettingsModel {
  theme: Theme;
  direction: Direction;
  language: Language;
  snackbarDuration: number;
}
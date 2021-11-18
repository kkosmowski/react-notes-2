import { SelectOption } from '../../Select/select-option.interface';
import { Theme } from '../enums/theme.enum';
import { Language } from '../enums/language.enum';
import { defaultSnackbarDuration } from './snackbar.const';
import { SettingsModel } from '../model/settings.model';

export const defaultSettings: SettingsModel = {
  theme: Theme.DarkGreen,
  direction: 'ltr',
  language: Language.EN,
  snackbarDuration: defaultSnackbarDuration,
};

export const themes: SelectOption[] = [
  { label: 'SETTINGS:THEME.DARK_GREEN', value: Theme.DarkGreen, translate: true, },
  { label: 'SETTINGS:THEME.DARK_BLUE', value: Theme.DarkBlue, translate: true, },
  // { label: 'SETTINGS:THEME_LIGHT', value: Theme.Light, translate: true, },
];
export const directions: SelectOption[] = [
  { label: 'SETTINGS:DIRECTION_LTR', value: 'ltr', translate: true, },
  { label: 'SETTINGS:DIRECTION_RTL', value: 'rtl', translate: true, },
];
export const languages: SelectOption[] = [
  { label: 'English', value: Language.EN },
  { label: 'Polski', value: Language.PL },
];

export const MIN_SNACKBAR_DURATION = 2000;
export const MAX_SNACKBAR_DURATION = 20000;
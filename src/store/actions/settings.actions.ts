import { createAction } from '@reduxjs/toolkit';
import { SettingsModel } from '../../domain/model/settings.model';
import { Theme } from '../../domain/enums/theme.enum';
import { Direction } from '../../domain/types/direction.type';
import { Language } from '../../domain/enums/language.enum';

const settingsActions = {
  openSettings: createAction<void>('OPEN_SETTINGS'),
  closeSettings: createAction<void>('CLOSE_SETTINGS'),

  fetchSettings: createAction<void>('FETCH_SETTINGS'),
  fetchSettingsSuccess: createAction<SettingsModel>('FETCH_SETTINGS_SUCCESS'),
  fetchSettingsFail: createAction<void>('FETCH_SETTINGS_FAIL'),

  updateTheme: createAction<void>('UPDATE_THEME'),
  updateThemeSuccess: createAction<Theme>('UPDATE_THEME_SUCCESS'),
  updateThemeFail: createAction<void>('UPDATE_THEME_FAIL'),

  updateDirection: createAction<void>('UPDATE_DIRECTION'),
  updateDirectionSuccess: createAction<Direction>('UPDATE_DIRECTION_SUCCESS'),
  updateDirectionFail: createAction<void>('UPDATE_DIRECTION_FAIL'),

  updateLanguage: createAction<void>('UPDATE_LANGUAGE'),
  updateLanguageSuccess: createAction<Language>('UPDATE_LANGUAGE_SUCCESS'),
  updateLanguageFail: createAction<void>('UPDATE_LANGUAGE_FAIL'),

  updateSnackbarDuration: createAction<void>('UPDATE_SNACKBAR_DURATION'),
  updateSnackbarDurationSuccess: createAction<number>('UPDATE_SNACKBAR_DURATION_SUCCESS'),
  updateSnackbarDurationFail: createAction<void>('UPDATE_SNACKBAR_DURATION_FAIL'),
};

export default settingsActions;
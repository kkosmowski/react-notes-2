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

  updateTheme: createAction<void>('UPDATE_THEME'),
  updateThemeSuccess: createAction<Theme>('UPDATE_THEME_SUCCESS'),

  updateDirection: createAction<void>('UPDATE_DIRECTION'),
  updateDirectionSuccess: createAction<Direction>('UPDATE_DIRECTION_SUCCESS'),

  updateLanguage: createAction<void>('UPDATE_LANGUAGE'),
  updateLanguageSuccess: createAction<Language>('UPDATE_LANGUAGE_SUCCESS'),

  updateSnackbarDuration: createAction<void>('UPDATE_SNACKBAR_DURATION'),
  updateSnackbarDurationSuccess: createAction<number>('UPDATE_SNACKBAR_DURATION_SUCCESS'),
};

export default settingsActions;
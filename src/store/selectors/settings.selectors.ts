import { RootState } from '../interfaces/root-state.interface';
import { createSelector } from 'reselect';
import { SettingsState } from '../interfaces/settings-state.interface';

const settingsSelector = (state: RootState) => state.settings;

export const selectSettingsOpened = createSelector(
  settingsSelector, (settings: SettingsState) => settings.opened
);

export const selectAllSettings = createSelector(
  settingsSelector, (settings: SettingsState) => settings
);

export const selectTheme = createSelector(
  settingsSelector, (settings: SettingsState) => settings.theme
);

export const selectDirection = createSelector(
  settingsSelector, (settings: SettingsState) => settings.direction
);

export const selectLanguage = createSelector(
  settingsSelector, (settings: SettingsState) => settings.language
);

export const selectSnackbarDuration = createSelector(
  settingsSelector, (settings: SettingsState) => settings.snackbarDuration
);

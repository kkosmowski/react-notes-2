import { SettingsState } from '../interfaces/settings-state.interface';
import { createReducer } from '@reduxjs/toolkit';
import settingsActions from '../actions/settings.actions';
import { defaultSettings } from '../../domain/consts/settings.consts';

export const initialSettingsState: SettingsState = {
  opened: false,
  fetchInProgress: false,
  ...defaultSettings,
};

const settingsReducer = createReducer(initialSettingsState, (builder) => {
  builder
    .addCase(settingsActions.openSettings, (state) => {
      state.opened = true;
    })
    .addCase(settingsActions.closeSettings, (state) => {
      state.opened = false;
    })

    .addCase(settingsActions.fetchSettings, (state) => {
      state.fetchInProgress = true;
    })
    .addCase(settingsActions.fetchSettingsSuccess, (state, { payload }) => {
      state.fetchInProgress = false;
      state.theme = payload.theme;
      state.direction = payload.direction;
      state.language = payload.language;
      state.snackbarDuration = payload.snackbarDuration;
    })
    .addCase(settingsActions.fetchSettingsFail, (state) => {
      state.fetchInProgress = false;
    })

    .addCase(settingsActions.updateThemeSuccess, (state, { payload }) => {
      state.theme = payload;
    })
    .addCase(settingsActions.updateDirectionSuccess, (state, { payload }) => {
      state.direction = payload;
    })
    .addCase(settingsActions.updateLanguageSuccess, (state, { payload }) => {
      state.language = payload;
    })
    .addCase(settingsActions.updateSnackbarDurationSuccess, (state, { payload }) => {
      state.snackbarDuration = payload;
    })
  ;
});

export default settingsReducer;
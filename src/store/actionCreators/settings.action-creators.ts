import { Action } from '../../domain/interfaces/action.interface';
import settingsActions from '../actions/settings.actions';
import { ActionFunction } from '../../domain/types/action-function.type';
import {
  DirectionSetting,
  LanguageSetting,
  SettingsModel,
  SnackbarDurationSetting,
  ThemeSetting
} from '../../domain/model/settings.model';
import { Theme } from '../../domain/enums/theme.enum';
import { Direction } from '../../domain/types/direction.type';
import { Language } from '../../domain/enums/language.enum';
import { Dispatch } from 'redux';
import categoryActions from '../actions/category.actions';
import { StorageService } from '../../services/storage.service';
import { defaultSettings } from '../../domain/consts/settings.consts';

const SettingsActions = {
  openSettings(): ActionFunction<void> {
    return (dispatch: Dispatch): void => {
      dispatch(settingsActions.openSettings());
      dispatch(categoryActions.clearCurrent());
    };
  },
  closeSettings(): Action {
    return settingsActions.closeSettings();
  },

  load(): ActionFunction<Promise<void>> {
    return async function(dispatch): Promise<void> {
      dispatch(settingsActions.fetchSettings());

      let settings = await StorageService.getAll<SettingsModel>('settings');

      if (settings.length !== 4) {
        settings = await StorageService.set<SettingsModel>('settings', null, [
          { id: 'theme', theme: defaultSettings.theme },
          { id: 'direction', direction: defaultSettings.direction },
          { id: 'language', language: defaultSettings.language },
          { id: 'snackbarDuration', snackbarDuration: defaultSettings.snackbarDuration },
        ]);
      }

      dispatch(settingsActions.fetchSettingsSuccess(settings));
    };
  },

  updateTheme(theme: Theme): ActionFunction<Promise<void>> {
    return async function(dispatch): Promise<void> {
      dispatch(settingsActions.updateTheme());

      const setting = await StorageService.update<ThemeSetting>(
        'settings',
        { id: 'theme' },
        { theme }
      );
      dispatch(settingsActions.updateThemeSuccess(setting.theme));
    };
  },
  updateDirection(direction: Direction): ActionFunction<Promise<void>> {
    return async function(dispatch): Promise<void> {
      dispatch(settingsActions.updateDirection());

      const setting = await StorageService.update<DirectionSetting>(
        'settings',
        { id: 'direction' },
        { direction }
      );
      dispatch(settingsActions.updateDirectionSuccess(setting.direction));
    };
  },
  updateLanguage(language: Language): ActionFunction<Promise<void>> {
    return async function(dispatch): Promise<void> {
      dispatch(settingsActions.updateLanguage());

      const setting = await StorageService.update<LanguageSetting>(
        'settings',
        { id: 'language' },
        { language }
      );
      dispatch(settingsActions.updateLanguageSuccess(setting.language));
    };
  },
  updateSnackbarDuration(snackbarDuration: number): ActionFunction<Promise<void>> {
    return async function(dispatch): Promise<void> {
      dispatch(settingsActions.updateSnackbarDuration());

      const setting = await StorageService.update<SnackbarDurationSetting>(
        'settings',
        { id: 'snackbarDuration' },
        { snackbarDuration }
      );
      dispatch(settingsActions.updateSnackbarDurationSuccess(setting.snackbarDuration));
    };
  },
};

export default SettingsActions;
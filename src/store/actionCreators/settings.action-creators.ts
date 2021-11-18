import { Action } from '../../domain/interfaces/action.interface';
import settingsActions from '../actions/settings.actions';
import { ActionFunction } from '../../domain/types/action-function.type';
import { HttpService } from '../../services/http.service';
import { SettingsModel } from '../../domain/model/settings.model';
import { Theme } from '../../domain/enums/theme.enum';
import { Direction } from '../../domain/types/direction.type';
import { Language } from '../../domain/enums/language.enum';

const SettingsActions = {
  openSettings(): Action {
    return settingsActions.openSettings();
  },
  closeSettings(): Action {
    return settingsActions.closeSettings();
  },

  load(): ActionFunction<Promise<void>> {
    return function(dispatch): Promise<void> {
      dispatch(settingsActions.fetchSettings());
      return HttpService
        .get('/settings')
        .then((settings: SettingsModel) => {
          dispatch(settingsActions.fetchSettingsSuccess(settings));
        })
        .catch((error) => {
          dispatch(settingsActions.fetchSettingsFail());
          console.error(error);
        });
    };
  },

  updateTheme(theme: Theme): ActionFunction<Promise<void>> {
    return function(dispatch): Promise<void> {
      dispatch(settingsActions.updateTheme());

      return HttpService
        .patch('/settings', { theme })
        .then(() => {
          dispatch(settingsActions.updateThemeSuccess(theme));
        })
        .catch((error) => {
          dispatch(settingsActions.updateThemeFail());
          console.error(error);
        });
    };
  },
  updateDirection(direction: Direction): ActionFunction<Promise<void>> {
    return function(dispatch): Promise<void> {
      dispatch(settingsActions.updateDirection());
      return HttpService
        .patch('/settings', { direction })
        .then(() => {
          dispatch(settingsActions.updateDirectionSuccess(direction));
        })
        .catch((error) => {
          dispatch(settingsActions.updateDirectionFail());
          console.error(error);
        });
    };
  },
  updateLanguage(language: Language): ActionFunction<Promise<void>> {
    return function(dispatch): Promise<void> {
      dispatch(settingsActions.updateLanguage());

      return HttpService
        .patch('/settings', { language })
        .then(() => {
          dispatch(settingsActions.updateLanguageSuccess(language));
        })
        .catch((error) => {
          dispatch(settingsActions.updateLanguageFail());
          console.error(error);
        });
    };
  },
  updateSnackbarDuration(snackbarDuration: number): ActionFunction<Promise<void>> {
    return function(dispatch): Promise<void> {
      dispatch(settingsActions.updateSnackbarDuration());

      return HttpService
        .patch('/settings', { snackbarDuration })
        .then(() => {
          dispatch(settingsActions.updateSnackbarDurationSuccess(snackbarDuration));
        })
        .catch((error) => {
          dispatch(settingsActions.updateSnackbarDurationFail());
          console.error(error);
        });
    };
  },
};

export default SettingsActions;
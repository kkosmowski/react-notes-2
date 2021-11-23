import { Action } from '../../domain/interfaces/action.interface';
import settingsActions from '../actions/settings.actions';
import { ActionFunction } from '../../domain/types/action-function.type';
import { HttpService } from '../../services/http.service';
import { SettingsModel } from '../../domain/model/settings.model';
import { Theme } from '../../domain/enums/theme.enum';
import { Direction } from '../../domain/types/direction.type';
import { Language } from '../../domain/enums/language.enum';
import { Dispatch } from 'redux';
import categoryActions from '../actions/category.actions';

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
    return function(dispatch): Promise<void> {
      dispatch(settingsActions.fetchSettings());
      return HttpService
        .get<SettingsModel>('/settings')
        .then((settings) => {
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
        .patch<{ theme: Theme }, Theme>('/settings', { theme })
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
        .patch<{ direction: Direction }, Direction>('/settings', { direction })
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
        .patch<{ language: Language }, Language>('/settings', { language })
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
        .patch<{ snackbarDuration: number }, number>('/settings', { snackbarDuration })
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
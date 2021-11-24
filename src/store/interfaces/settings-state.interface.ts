import { SettingsInterface } from '../../domain/model/settings.model';

export interface SettingsState extends SettingsInterface {
  opened: boolean;
  fetchInProgress: boolean;
}
import { SettingsModel } from '../../domain/model/settings.model';

export interface SettingsState extends SettingsModel {
  opened: boolean;
  fetchInProgress: boolean;
}
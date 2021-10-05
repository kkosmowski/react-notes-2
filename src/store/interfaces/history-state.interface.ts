import { ActionDetails } from '../../domain/interfaces/action-details.interface';

export interface HistoryState {
  records: ActionDetails[];
}
import { UiState } from './ui-state.interface';
import { NoteState } from './note-state.interface';
import { CategoryState } from './category-state.interface';
import { HistoryState } from './history-state.interface';

export interface RootState {
  ui: UiState;
  note: NoteState;
  category: CategoryState;
  history: HistoryState;
}
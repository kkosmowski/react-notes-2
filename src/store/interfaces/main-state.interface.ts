import { UiState } from './ui-state.interface';
import { NoteState } from './note-state.interface';
import { CategoryState } from './category-state.interface';

export interface MainState {
  ui: UiState;
  note: NoteState;
  category: CategoryState;
}
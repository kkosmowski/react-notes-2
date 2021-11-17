import { RootState } from '../store/interfaces/root-state.interface';
import { initialUiState } from '../store/reducers/ui.reducer';
import { initialNoteState } from '../store/reducers/note.reducer';
import { initialCategoryState } from '../store/reducers/category.reducer';
import { initialHistoryState } from '../store/reducers/history.reducer';
import { initialSettingsState } from '../store/reducers/settings.reducer';

export const initialRootState: RootState = {
  ui: initialUiState,
  note: initialNoteState,
  category: initialCategoryState,
  history: initialHistoryState,
  settings: initialSettingsState,
};
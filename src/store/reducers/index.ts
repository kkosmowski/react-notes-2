import { combineReducers } from '@reduxjs/toolkit';
import uiReducer from './ui.reducer';
import noteReducer from './note.reducer';
import categoryReducer from './category.reducer';
import historyReducer from './history.reducer';
import settingsReducer from './settings.reducer';

const rootReducer = combineReducers({
  ui: uiReducer,
  note: noteReducer,
  category: categoryReducer,
  history: historyReducer,
  settings: settingsReducer,
});

export default rootReducer;
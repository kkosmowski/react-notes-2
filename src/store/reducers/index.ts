import { combineReducers } from '@reduxjs/toolkit';
import uiReducer from './ui.reducer';
import noteReducer from './note.reducer';
import categoryReducer from './category.reducer';

const rootReducer = combineReducers({
  ui: uiReducer,
  note: noteReducer,
  category: categoryReducer,
});

export default rootReducer;
import ui from './ui.reducer';
import { combineReducers, ReducersMapObject } from 'redux';
import { note } from './note.reducer';
import { category } from './category.reducer';

const reducers: ReducersMapObject = {
  ui,
  note,
  category
};

export default combineReducers(reducers);
import ui from './ui.reducer';
import { combineReducers, ReducersMapObject } from 'redux';

const reducers: ReducersMapObject = {
  ui
};

export default combineReducers(reducers);
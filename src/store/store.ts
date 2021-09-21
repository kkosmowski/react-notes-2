import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import thunk from 'redux-thunk';

const store: EnhancedStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware => getDefaultMiddleware().concat(thunk)),
  devTools: true
});

export default store;
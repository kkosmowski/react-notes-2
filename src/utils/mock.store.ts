import configurableMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { RootState } from '../store/interfaces/root-state.interface';

const middlewares = [thunk];
export const mockStore = configurableMockStore<RootState>(middlewares);
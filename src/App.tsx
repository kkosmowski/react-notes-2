import { Main } from './Main/Main';
import { Sidebar } from './Sidebar/Sidebar';
import { ReactElement } from 'react';
import store from './store/store';
import { Provider } from 'react-redux';

export const App = (): ReactElement => (
  <>
    <Sidebar />
    <Main />
  </>
);

export const ProvidedApp = (): ReactElement => (
  <Provider store={ store }>
    <App />
  </Provider>
);
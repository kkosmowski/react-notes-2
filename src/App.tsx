import { Main } from './Main/Main';
import { Sidebar } from './Sidebar/Sidebar';
import { ReactElement } from 'react';
import store from './store/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

export const App = (): ReactElement => (
  <BrowserRouter>
    <Sidebar />
    <Main />
  </BrowserRouter>
);

export const ProvidedApp = (): ReactElement => (
  <Provider store={ store }>
    <App />
  </Provider>
);
import { Main } from './Main/Main';
import { Sidebar } from './Sidebar/Sidebar';
import { ReactElement } from 'react';
import store from './store/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ContextMenu } from './ContextMenu/ContextMenu';

export const App = (): ReactElement => (
  <BrowserRouter>
    <Sidebar />
    <Main />
    <ContextMenu />
  </BrowserRouter>
);

export const ProvidedApp = (): ReactElement => (
  <Provider store={ store }>
    <App />
  </Provider>
);
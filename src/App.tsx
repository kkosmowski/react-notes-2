import { Main } from './Main/Main';
import { Sidebar } from './Sidebar/Sidebar';
import { ReactElement, useEffect, useState } from 'react';
import store from './store/store';
import { Provider, useDispatch } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ContextMenu } from './ContextMenu/ContextMenu';
import { debounce } from '@material-ui/core';
import UiActions from './store/actionCreators/ui.action-creators';
import { ThemeProvider } from 'styled-components/macro';
import theme from './theme';

export const App = (): ReactElement => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    checkIfMobile();
  }, []);

  useEffect(() => {
    dispatch(UiActions.setIsMobile(isMobile));
  }, [dispatch, isMobile]);

  useEffect(() => {
    window.addEventListener('resize', debounce(checkIfMobile, 100));

    return () => {
      window.removeEventListener('resize', debounce(checkIfMobile, 100));
    };
  });

  const checkIfMobile = (): void => {
    setIsMobile(window.innerWidth < 600);
  };

  return (
    <BrowserRouter>
      <Sidebar/>
      <Main/>
      <ContextMenu/>
    </BrowserRouter>
  );
};

export const ProvidedApp = (): ReactElement => (
  <Provider store={ store }>
    <ThemeProvider theme={ theme }>
      <App />
    </ThemeProvider>
  </Provider>
);
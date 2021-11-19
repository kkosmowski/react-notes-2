import { Main } from './Main/Main';
import { Sidebar } from './Sidebar/Sidebar';
import { ReactElement, useEffect, useState } from 'react';
import store from './store/store';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ContextMenu } from './ContextMenu/ContextMenu';
import { debounce } from '@material-ui/core';
import UiActions from './store/actionCreators/ui.action-creators';
import { ThemeProvider } from 'styled-components/macro';
import theme from './theme';
import SettingsActions from './store/actionCreators/settings.action-creators';
import { selectDirection, selectLanguage, selectTheme } from './store/selectors/settings.selectors';
import i18n from './i18n';
import NoteActions from './store/actionCreators/note.action-creators';

export const App = (): ReactElement => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const theme = useSelector(selectTheme);
  const direction = useSelector(selectDirection);
  const language = useSelector(selectLanguage);
  const dispatch = useDispatch();

  useEffect(() => {
    checkIfMobile();
    dispatch(SettingsActions.load());
    dispatch(NoteActions.fetchShowArchived());
    window.addEventListener('resize', debounce(checkIfMobile, 100));

    return () => {
      window.removeEventListener('resize', debounce(checkIfMobile, 100));
    };
  }, []);

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [i18n, language]);

  useEffect(() => {
    document.body.className = `${ theme } ${ direction }`;
  }, [theme, direction]);

  useEffect(() => {
    dispatch(UiActions.setIsMobile(isMobile));
  }, [dispatch, isMobile]);

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
import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import { ProvidedApp } from './App';
import './i18n.ts';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

ReactDOM.render(
  <React.StrictMode>
    <ProvidedApp />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorkerRegistration.register();
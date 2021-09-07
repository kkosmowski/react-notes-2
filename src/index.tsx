import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import { App } from './App';
import './i18n.ts';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


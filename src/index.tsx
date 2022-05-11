import "@babel/polyfill";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import './assets/css/app-ui.css'
import './assets/css/app-list.css'
import './assets/css/app-list-content.css'
import './assets/css/app-list-header.css'
import './assets/css/app-list-item.css'
import './assets/css/app-chart.css'
import './assets/css/app-toolbar.css'
import './assets/css/app-sidebar.css'
import './assets/css/app-tooltips.css'

import { AppRouter } from './views/AppRouter'
import RegisterServiceWorker from './ServiceWorker';

console.log("App env " + process.env.NODE_ENV);
console.log("App url \n" + window.location);

ReactDOM.render(
  <BrowserRouter>
    <AppRouter/>
  </BrowserRouter>,
  document.getElementById('root') as HTMLElement
);

RegisterServiceWorker();



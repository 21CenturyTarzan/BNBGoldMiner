import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import * as serviceWorker from './serviceWorker';
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./providers/AuthProvider";
import { ContractProvider } from "./providers/ContractProvider";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import FomoJack from './FomoJack';



ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ContractProvider>
          <App />
        </ContractProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import './header.css';
import FunctionOperationsLab from './components/FunctionOperationsLab';

const isFunctionsRoute = window.location.pathname.replace(/\/$/,'').endsWith('/math/functions');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>{isFunctionsRoute ? <FunctionOperationsLab /> : <App />}</React.StrictMode>
);

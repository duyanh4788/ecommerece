import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './app/home/container/Home';
import reportWebVitals from './reportWebVitals';
import './styles/index.css';

const isDevelopment = process.env.NODE_ENV === 'development';

const MOUNT_NODE = document.getElementById('root') as HTMLElement;

const ConnectedApp = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  </BrowserRouter>
);

const render = () => {
  ReactDOM.render(<ConnectedApp />, MOUNT_NODE);
};

if (isDevelopment && (module as any).hot) {
  (module as any).hot.accept();
}

render();

reportWebVitals();

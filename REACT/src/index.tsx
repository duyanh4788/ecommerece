import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Box } from '@mui/material';
import 'swiper/css';
import '../src/assets/styles/main/index.scss';
import { AppRouting } from 'router/AppRouting';
import { Navbar, Footer } from 'app';
import { RootStore } from 'store/configStore';
import { createRoot } from 'react-dom/client';
import { AuthContextProvider } from 'app/AuthContext/AuthContextApi';
import reportWebVitals from 'webvitals/reportWebVitals';
import { CONFIG_ENV } from 'utils/config';
import { SocketContextProvider } from 'app/SocketContext/SocketContextApi';

export const isDevelopment = CONFIG_ENV.NODE_ENV === 'development' ? true : false;

const MOUNT_NODE = document.getElementById('root') as HTMLElement;

const ConnectedApp = () => (
  <HashRouter>
    <Provider store={RootStore}>
      <AuthContextProvider>
        <SocketContextProvider>
          <HelmetProvider>
            <Box component="section">
              <Navbar />
              <Box component="main">
                <Routes>
                  {AppRouting.map(item => {
                    const { key, path, Component, title } = item;
                    return (
                      <Route
                        key={key}
                        path={path}
                        element={
                          <React.Fragment>
                            <Helmet>
                              <title>{title}</title>
                              <meta name="description" content={title} />
                            </Helmet>
                            <Component />
                          </React.Fragment>
                        }
                      />
                    );
                  })}
                </Routes>
              </Box>
              <Footer />
            </Box>
          </HelmetProvider>
        </SocketContextProvider>
      </AuthContextProvider>
    </Provider>
  </HashRouter>
);

const render = () => {
  createRoot(MOUNT_NODE).render(<ConnectedApp />);
};

if (isDevelopment && (module as any).hot) {
  (module as any).hot.accept();
}

render();
reportWebVitals();

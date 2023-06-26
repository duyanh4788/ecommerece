import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Navbar, Footer, Home, SignIn, SignUp, Password } from 'app';
import '../src/assets/styles/main/index.css';
import reportWebVitals from './reportWebVitals';
import { RootStore } from 'store/configStore';
import { createRoot } from 'react-dom/client';
import { AuthContextProvider } from 'app/AuthContext/AuthContextApi';
import { PATH_PARAMS } from 'commom/common.contants';
import { NotFound, Profile } from 'router/lazyRouting';
import 'swiper/css';

const isDevelopment = process.env.NODE_ENV === 'development';

const MOUNT_NODE = document.getElementById('root') as HTMLElement;

const ConnectedApp = () => (
  <BrowserRouter>
    <Provider store={RootStore}>
      <AuthContextProvider>
        <section className="home_app">
          <Navbar />
          <main>
            <Routes>
              <Route path={PATH_PARAMS.HOME} element={<Home />} />
              <Route path={PATH_PARAMS.SIGNIN} element={<SignIn />} />
              <Route path={PATH_PARAMS.SIGNUP} element={<SignUp />} />
              <Route path={PATH_PARAMS.PASSW} element={<Password />} />
              <Route path={PATH_PARAMS.PROFILE} element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </section>
      </AuthContextProvider>
    </Provider>
  </BrowserRouter>
);

const render = () => {
  createRoot(MOUNT_NODE).render(<ConnectedApp />);
};

if (isDevelopment && (module as any).hot) {
  (module as any).hot.accept();
}

render();

reportWebVitals();

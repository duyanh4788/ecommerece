import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Navbar, Footer, Home, SignIn, SignUp, Password } from 'app';
import '../src/assets/styles/main/index.css';
import reportWebVitals from './reportWebVitals';
import { RootStore } from 'store/configStore';
import { createRoot } from 'react-dom/client';
import { AuthContextProvider } from 'app/authContext/AuthContextApi';

const isDevelopment = process.env.NODE_ENV === 'development';

const MOUNT_NODE = document.getElementById('root') as HTMLElement;

const ConnectedApp = () => (
  <BrowserRouter>
    <Provider store={RootStore}>
      <AuthContextProvider>
        <Navbar />
        <section className="home_app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/password" element={<Password />} />
          </Routes>
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

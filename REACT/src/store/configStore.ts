import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createInjectorsEnhancer, forceReducerReload } from 'redux-injectors';
import createSagaMiddleware from 'redux-saga';
import { createReducer } from './rootReducer';
import { refreshAuthToken } from './refreshAuthToken';
import { CONFIG_ENV } from 'utils/config';

export function configureAppstore() {
  const reduxSagaMonitorOptions = {};
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const { run: runSaga } = sagaMiddleware;

  let middlewares = [sagaMiddleware];
  if (CONFIG_ENV.NODE_ENV === 'development') {
    middlewares = [...middlewares];
  }

  const enhancers = [
    createInjectorsEnhancer({
      createReducer,
      runSaga,
    }),
  ];

  const defaultMiddelWare: any[] = getDefaultMiddleware({
    thunk: false,
    serializableCheck: false,
    immutableCheck: false,
  });

  const store = configureStore({
    reducer: createReducer(),
    middleware: [...defaultMiddelWare, refreshAuthToken, ...middlewares],
    devTools: CONFIG_ENV.NODE_ENV !== 'production',
    enhancers,
  });

  if (import.meta.hot) {
    import.meta.hot.accept('./rootReducer', () => {
      forceReducerReload(store);
    });
  }

  return store;
}

export const RootStore = configureAppstore();

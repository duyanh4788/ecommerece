import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createInjectorsEnhancer, forceReducerReload } from 'redux-injectors';
import createSagaMiddleware from 'redux-saga';
import { createReducer } from './rootReducer';
import { LocalStorageKey, LocalStorageService } from 'services/localStorage';
import * as AuthSlice from 'store/auth/shared/slice';
import { AppHelper } from 'utils/app.helper';

const local = new LocalStorageService();

export function configureAppstore() {
  const reduxSagaMonitorOptions = {};
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const { run: runSaga } = sagaMiddleware;

  let middlewares = [sagaMiddleware];
  if (process.env.NODE_ENV === 'development') {
    middlewares = [...middlewares];
  }

  const refreshAuthToken = store => {
    let isRefreshingToken = false;

    return next => action => {
      const userStore = local.getItem(LocalStorageKey.user);
      if (userStore && AppHelper.validateExpired(Number(userStore?.expired))) {
        if (action.type === AuthSlice.actions.refreshToken.type) {
          if (isRefreshingToken) {
            return next(action);
          }
        } else {
          if (!isRefreshingToken) {
            isRefreshingToken = true;
            store.dispatch(AuthSlice.actions.refreshToken());
          }
          return next(action);
        }
      } else {
        return next(action);
      }
    };
  };

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
    middleware: [...defaultMiddelWare, ...middlewares, refreshAuthToken],
    devTools: process.env.NODE_ENV !== 'production' || process.env.PUBLIC_URL.length > 0,
    enhancers,
  });

  if ((module as any).hot) {
    (module as any).hot.accept('./rootReducer', () => {
      forceReducerReload(store);
    });
  }
  return store;
}

export const RootStore = configureAppstore();

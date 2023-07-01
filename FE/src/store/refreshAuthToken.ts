import { localStorage } from 'hooks/localStorage/LocalStorage';
import { LocalStorageKey, TypeLocal } from 'services/localStorage';
import { AppHelper } from 'utils/app.helper';
import * as AuthSlice from 'store/auth/shared/slice';

export const refreshAuthToken = store => {
  let isRefreshingToken: boolean = false;
  let actionQueue: any[] = [];

  return next => async action => {
    const userStore = localStorage(TypeLocal.GET, LocalStorageKey.user);
    const refreshToken = store.getState().auth.refreshToken;

    if (userStore && !AppHelper.validateExpired(Number(userStore?.expired)) && isRefreshingToken) {
      isRefreshingToken = false;
    }

    if (userStore && AppHelper.validateExpired(Number(userStore?.expired))) {
      if (!isRefreshingToken) {
        isRefreshingToken = true;
        await store.dispatch(AuthSlice.actions.refreshToken());
      } else {
        if (action.type !== AuthSlice.actions.refreshToken.type) {
          actionQueue.push(action);
        }
      }
    } else {
      return next(action);
    }

    const updateLocalStorageFromTemp = () => {
      if (refreshToken) {
        localStorage(TypeLocal.SET, LocalStorageKey.user, refreshToken);
        store.dispatch(AuthSlice.actions.clearRefreshToKen());
      }
    };

    updateLocalStorageFromTemp();

    while (actionQueue.length > 0) {
      const queuedAction = actionQueue.shift();
      next(queuedAction);
    }
  };
};

import { localStorage } from 'hooks/localStorage/LocalStorage';
import { LocalStorageKey, TypeLocal } from 'services/localStorage';
import { AppHelper } from 'utils/app.helper';
import * as AuthSlice from 'store/auth/shared/slice';

export const refreshAuthToken = store => {
  let isRefreshingToken: boolean = false;
  let actionQueue: any[] = [];

  return next => action => {
    const userStore = localStorage(TypeLocal.GET, LocalStorageKey.user);

    if (userStore && !AppHelper.validateExpired(Number(userStore?.expired)) && isRefreshingToken) {
      isRefreshingToken = false;
    }

    if (userStore && AppHelper.validateExpired(Number(userStore?.expired))) {
      if (!isRefreshingToken) {
        if (action.type !== AuthSlice.actions.refreshToken.type) {
          action = {
            type: AuthSlice.actions.refreshToken.type,
            payload: undefined,
          };
          isRefreshingToken = true;
          return next(action);
        }
      } else {
        if (action.type !== AuthSlice.actions.refreshToken.type) {
          actionQueue.push(action);
        }
      }
    } else {
      return next(action);
    }

    if (action.type === AuthSlice.actions.refreshTokenSuccess.type) {
      localStorage(TypeLocal.SET, LocalStorageKey.user, action.payload.data);
      const find = actionQueue.find(
        item => item.type === AuthSlice.actions.refreshTokenSuccess.type,
      );
      if (find) {
        actionQueue = actionQueue.filter(
          item => item.type !== AuthSlice.actions.refreshTokenSuccess.type,
        );
        store.dispatch(AuthSlice.actions.clearRefreshToKen());
        next(find);
      }
      store.dispatch(AuthSlice.actions.getUserById());
      while (actionQueue.length > 0) {
        const queuedAction = actionQueue.shift();
        next(queuedAction);
      }
      return;
    }

    if (action.type === AuthSlice.actions.refreshTokenFail.type) {
      return next(action);
    }
  };
};

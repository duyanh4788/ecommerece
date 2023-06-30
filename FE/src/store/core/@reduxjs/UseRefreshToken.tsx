import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LocalStorageKey, LocalStorageService } from 'services/localStorage';
import * as AuthSlice from 'store/auth/shared/slice';
import * as AuthSelector from 'store/auth/shared/selectors';
import { AppHelper } from 'utils/app.helper';

export function UseRefreshToken() {
  const dispatch = useDispatch();
  const refreshToken = useSelector(AuthSelector.selectRefreshToken);

  // useEffect(() => {
  //   const tokenLocal = localService.getItem(LocalStorageKey.user);
  //   if (tokenLocal && AppHelper.validateExpired(Number(tokenLocal?.expired))) {
  //     dispatch(AuthSlice.actions.refreshToken());
  //     window.location.reload();
  //   }
  // }, []);

  // useEffect(() => {
  //   if (refreshToken) {
  //     localService.setItem({ key: LocalStorageKey.user, value: refreshToken });
  //   }
  // }, [refreshToken]);

  return;
}

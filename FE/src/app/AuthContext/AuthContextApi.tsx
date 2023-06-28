/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as AuthSlice from 'store/auth/shared/slice';
import * as AuthSelector from 'store/auth/shared/selectors';
import { AuthSaga } from 'store/auth/shared/saga';
import { useInjectReducer, useInjectSaga } from 'store/core/@reduxjs/redux-injectors';
import { LocalStorageKey, LocalStorageService } from 'services/localStorage';
import { useNavigate } from 'react-router-dom';
import { PATH_PARAMS } from 'commom/common.contants';

export const AuthContext = React.createContext({});
export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const local = new LocalStorageService();
  const userStore = local.getItem(LocalStorageKey.user);

  useInjectReducer({
    key: AuthSlice.sliceKey,
    reducer: AuthSlice.reducer,
  });
  useInjectSaga({
    key: AuthSlice.sliceKey,
    saga: AuthSaga,
  });
  const userInfor = useSelector(AuthSelector.selectUserInfor);

  useEffect(() => {
    function handleUser(user) {
      if (!user) return;
      dispatch(AuthSlice.actions.getUserById());
      return;
    }
    handleUser(userStore);
  }, []);

  return <AuthContext.Provider value={userInfor || {}}>{children}</AuthContext.Provider>;
};

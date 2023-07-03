/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as AuthSlice from 'store/auth/shared/slice';
import * as AuthSelector from 'store/auth/shared/selectors';
import { LocalStorageKey, TypeLocal } from 'services/localStorage';
import { localStorage } from 'hooks/localStorage/LocalStorage';
import { useInjectSlicesAndSagas } from 'store/core/map/mapServices';

export const AuthContext = React.createContext({});
export const AuthContextProvider = ({ children }) => {
  useInjectSlicesAndSagas();
  const dispatch = useDispatch();
  const userStore = localStorage(TypeLocal.GET, LocalStorageKey.user);
  const userInfor = useSelector(AuthSelector.selectUserInfor);

  useEffect(() => {
    function handleUser(userS) {
      if (userS) {
        dispatch(AuthSlice.actions.getUserById());
        return;
      }
    }
    handleUser(userStore);
  }, []);

  return <AuthContext.Provider value={userInfor || {}}>{children}</AuthContext.Provider>;
};

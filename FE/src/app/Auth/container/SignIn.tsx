/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Input, Link } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LocalStorageKey, LocalStorageService } from 'services/localStorage';
import { AuthSaga } from 'store/auth/shared/saga';
import * as AuthSlice from 'store/auth/shared/slice';
import * as AuthSelector from 'store/auth/shared/selectors';
import { Loading } from 'commom/loading';
import { Users } from 'interface/Users.model';
import { useInjectReducer, useInjectSaga } from 'store/core/@reduxjs/redux-injectors';
import { Unsubscribe } from 'redux';
import { RootStore } from 'store/configStore';
import { Notification } from 'commom/notification';
import { defaultNotifi, pathParams } from 'commom/common.contants';

const defaultValue = {
  email: '',
  password: '',
  showPassword: false,
};

export const SignIn = () => {
  const local = new LocalStorageService();
  const loading = useSelector(AuthSelector.selectLoading);
  const dispatch = useDispatch();
  const [user, setUser] = useState<Users>(defaultValue);
  const [errors, setErrors] = useState<Users>(defaultValue);
  const [notifi, setNotifi] = useState(defaultNotifi);
  useInjectReducer({
    key: AuthSlice.sliceKey,
    reducer: AuthSlice.reducer,
  });
  useInjectSaga({
    key: AuthSlice.sliceKey,
    saga: AuthSaga,
  });

  useEffect(() => {
    const storeSub$: Unsubscribe = RootStore.subscribe(() => {
      const { type, payload } = RootStore.getState().lastAction;
      switch (type) {
        case AuthSlice.actions.signInSuccess.type:
          local.setItem({ key: LocalStorageKey.user, value: payload.data });
          dispatch(AuthSlice.actions.getUserById());
          setNotifi({ status: payload.status, message: payload.message, path: pathParams.HOME });
          break;
        case AuthSlice.actions.signInFail.type:
        case AuthSlice.actions.getUserByIdFail.type:
          setNotifi({ ...defaultNotifi, status: payload.status, message: payload.message });
          break;
        default:
          break;
      }
    });
    return () => {
      storeSub$();
      dispatch(AuthSlice.actions.clearData());
    };
  }, []);

  const handleChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = event => {
    event.preventDefault();
    const newErrors: any = {};
    if (!user.email) {
      newErrors.email = 'Please enter your email';
      setErrors(newErrors);
      return;
    }
    if (!user.password) {
      newErrors.password = 'Please enter your password';
      setErrors(newErrors);
      return;
    }
    dispatch(AuthSlice.actions.signIn(user));
  };

  const validateButton = () => {
    if (user.email === '' || user.password === '') return false;
    return true;
  };

  return (
    <div className="sign_in">
      {loading && <Loading />}
      {notifi.status && <Notification {...notifi} onClose={() => setNotifi(defaultNotifi)} />}
      <div className="wrap_login">
        <h5>Sign in</h5>
        <form noValidate onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
          {errors.email && <span className="msg_error">*{errors.email}</span>}

          <Input
            id="standard-adornment-password"
            className="input_show"
            name="password"
            type={user.showPassword ? 'text' : 'password'}
            value={user.password}
            onChange={handleChange}
            endAdornment={
              <span
                className="show_pw"
                aria-label="toggle password visibility"
                onClick={() => setUser({ ...user, showPassword: !user.showPassword })}
                onMouseDown={e => e.preventDefault()}>
                {user.showPassword ? <Visibility /> : <VisibilityOff />}
              </span>
            }
          />
          {errors.password && <span className="msg_error">*{errors.password}</span>}

          <div style={{ textAlign: 'center' }}>
            <button
              type="submit"
              disabled={!validateButton()}
              style={{ cursor: !validateButton() ? 'no-drop' : 'pointer' }}>
              Sign In
            </button>
          </div>
        </form>
        <Box>
          <Link href={pathParams.SIGNUP}>Create account</Link>
        </Box>
        <Box>
          <Link href={pathParams.PASSW}>Forgot Password</Link>
        </Box>
      </div>
    </div>
  );
};

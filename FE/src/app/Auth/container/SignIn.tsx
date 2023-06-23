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
import { PATH_PARAMS } from 'commom/common.contants';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const defaultValue: any = {
  email: '',
  password: '',
  showPassword: false,
};

export const SignIn = () => {
  const local = new LocalStorageService();
  const loading = useSelector(AuthSelector.selectLoading);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState<Users>(defaultValue);
  const [errors, setErrors] = useState<Users>(defaultValue);

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
          resetData();
          local.setItem({ key: LocalStorageKey.user, value: payload.data });
          dispatch(AuthSlice.actions.getUserById());
          toast.success(payload.message);
          navigate(PATH_PARAMS.HOME);
          break;
        case AuthSlice.actions.signInFail.type:
        case AuthSlice.actions.getUserByIdFail.type:
          toast.error(payload.message);
          break;
        default:
          break;
      }
    });
    return () => {
      storeSub$();
      dispatch(AuthSlice.actions.clearData());
      resetData();
    };
  }, []);

  const resetData = () => {
    setUser(defaultValue);
    setErrors(defaultValue);
  };

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
      newErrors.isError = true;
      setErrors(newErrors);
      return;
    }
    if (!user.password) {
      newErrors.password = 'Please enter your password';
      newErrors.isError = true;
      setErrors(newErrors);
      return;
    }
    dispatch(AuthSlice.actions.signIn(user));
  };

  const validate = () => {
    if (!user.email || !user.password) {
      return false;
    }
    return true;
  };

  return (
    <div className="sign_in">
      {loading && <Loading />}
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
              disabled={!validate()}
              style={{ cursor: !validate() ? 'no-drop' : 'pointer' }}>
              Sign In
            </button>
          </div>
        </form>
        <Box>
          <Link href={PATH_PARAMS.SIGNUP}>Create account</Link>
        </Box>
        <Box>
          <Link href={PATH_PARAMS.PASSW}>Forgot Password</Link>
        </Box>
      </div>
    </div>
  );
};

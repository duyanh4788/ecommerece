/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Box, Chip, Input, Link } from '@mui/material';
import { PATH_PARAMS, TYPE_RESET_PW } from 'commom/common.contants';
import { useInjectReducer, useInjectSaga } from 'store/core/@reduxjs/redux-injectors';
import { AuthSaga } from 'store/auth/shared/saga';
import * as AuthSlice from 'store/auth/shared/slice';
import { useDispatch } from 'react-redux';
import { Unsubscribe } from 'redux';
import { RootStore } from 'store/configStore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { localStorage } from 'hooks/localStorage/LocalStorage';
import { LocalStorageKey, TypeLocal } from 'services/localStorage';

const defaultValue: any = {
  email: '',
  newPassWord: '',
  authCode: '',
};

export const Password = () => {
  const userLocal = localStorage(TypeLocal.GET, LocalStorageKey.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState(defaultValue);
  const [errors, setErrors] = useState(defaultValue);
  const [typePage, setTypePage] = useState<boolean>(true);

  useInjectReducer({
    key: AuthSlice.sliceKey,
    reducer: AuthSlice.reducer,
  });
  useInjectSaga({
    key: AuthSlice.sliceKey,
    saga: AuthSaga,
  });

  useEffect(() => {
    if (userLocal) {
      navigate(PATH_PARAMS.HOME);
    }
    const storeSub$: Unsubscribe = RootStore.subscribe(() => {
      const { type, payload } = RootStore.getState().lastAction;
      switch (type) {
        case AuthSlice.actions.forgotPasswordSuccess.type:
          toast.success(payload.message);
          setTypePage(false);
          break;
        case AuthSlice.actions.resendForgotPasswordSuccess.type:
          toast.success(payload.message);
          break;
        case AuthSlice.actions.resetForgotPasswordSuccess.type:
          resetData();
          toast.success(payload.message);
          navigate(PATH_PARAMS.SIGNIN);
          break;
        case AuthSlice.actions.forgotPasswordFail.type:
        case AuthSlice.actions.resendForgotPasswordFail.type:
        case AuthSlice.actions.resetForgotPasswordFail.type:
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
    setTypePage(true);
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = (event, type: string) => {
    event.preventDefault();
    handleResetPassWord(type);
  };

  const handleResetPassWord = (type: string) => {
    if (!validate()) {
      toast.error('Please input the email!');
      return;
    }
    switch (type) {
      case TYPE_RESET_PW.FORGOT:
        dispatch(AuthSlice.actions.forgotPassword(user));
        break;
      case TYPE_RESET_PW.RESEND:
        dispatch(AuthSlice.actions.resendForgotPassword(user));
        break;
      case TYPE_RESET_PW.RESET:
        dispatch(AuthSlice.actions.resetForgotPassword(user));
        break;
      default:
        break;
    }
  };
  const validate = () => {
    if (typePage && !user.email) {
      return false;
    }
    if (!typePage) {
      if (!user.email || !user.newPassWord || !user.authCode) return false;
    }
    return true;
  };

  return (
    <div className="sign_in">
      <div className="wrap_login">
        {typePage ? <h5>Forgot Password</h5> : <h5>Reset Password</h5>}
        <form
          noValidate
          onSubmit={e => handleSubmit(e, typePage ? TYPE_RESET_PW.FORGOT : TYPE_RESET_PW.RESET)}>
          {typePage ? (
            <React.Fragment>
              <input
                type="text"
                placeholder="Email"
                name="email"
                value={user.email}
                onChange={handleChange}
              />
              {errors.email && <span className="msg_error">*{errors.email}</span>}
              <Chip
                label="Resend"
                color="success"
                variant="outlined"
                size="small"
                onClick={() => handleResetPassWord(TYPE_RESET_PW.RESEND)}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
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
                name="newPassWord"
                type={user.showPassword ? 'text' : 'password'}
                value={user.newPassWord}
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
              {errors.newPassWord && <span className="msg_error">*{errors.newPassWord}</span>}
              <input
                type="text"
                placeholder="Auth Code"
                name="authCode"
                value={user.authCode}
                onChange={handleChange}
              />
              {errors.authCode && <span className="msg_error">*{errors.authCode}</span>}
            </React.Fragment>
          )}

          <div style={{ textAlign: 'center' }}>
            <button
              type="submit"
              disabled={!validate()}
              style={{ cursor: !validate() ? 'no-drop' : 'pointer' }}>
              {typePage ? ' Fogot Password' : 'Reset Password'}{' '}
            </button>
          </div>
        </form>
        <Box>
          {typePage ? (
            <Link onClick={() => setTypePage(false)}>You have code</Link>
          ) : (
            <Link onClick={() => setTypePage(true)}>Back</Link>
          )}
        </Box>
        <Box>
          <Link href={PATH_PARAMS.SIGNIN}>Sign In</Link>
        </Box>
      </div>
    </div>
  );
};

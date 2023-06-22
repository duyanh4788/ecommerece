/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Input, Link } from '@mui/material';
import { Visibility, VisibilityOff, Password, EnhancedEncryptionSharp } from '@mui/icons-material';
import { useInjectReducer, useInjectSaga } from 'store/core/@reduxjs/redux-injectors';
import { AuthSaga } from 'store/auth/shared/saga';
import * as AuthSlice from 'store/auth/shared/slice';
import * as AuthSelector from 'store/auth/shared/selectors';
import { Unsubscribe } from 'redux';
import { RootStore } from 'store/configStore';
import { useDispatch, useSelector } from 'react-redux';
import { Loading } from 'commom/loading';
import { Notification } from 'commom/notification';
import { defaultNotifi, pathParams } from 'commom/common.contants';

export const SignUp = () => {
  const dispatch = useDispatch();

  const loading = useSelector(AuthSelector.selectLoading);
  const [notifi, setNotifi] = useState(defaultNotifi);

  const [user, setUser] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    showPassword: false,
  });
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

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
        case AuthSlice.actions.signUpSuccess.type:
          setNotifi({ status: payload.status, message: payload.message, path: '/signin' });
          break;
        case AuthSlice.actions.signUpFail.type:
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
    setUser(prevUser => ({ ...prevUser, [name]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    // Thực hiện các logic xử lý khi submit form
    const newErrors: any = {};
    if (!user.email) {
      newErrors.email = 'Please enter your email';
    }
    if (!user.password && !user.confirmPassword) {
      newErrors.password = 'Please enter your password';
      newErrors.confirmPassword = 'Please enter your password';
    }
    if (!user.fullName) {
      newErrors.fullName = 'Please enter your name';
    }
    if (user.password !== user.confirmPassword) {
      newErrors.password = 'Password not match';
      newErrors.confirmPassword = 'Password not match';
    }
    setErrors(newErrors);
    dispatch(AuthSlice.actions.signUp(user));
  };

  return (
    <div className="sign_in">
      {loading && <Loading />}
      {notifi.status && <Notification {...notifi} onClose={() => setNotifi(defaultNotifi)} />}

      <div className="wrap_login">
        <h5>Sign Up</h5>
        <form noValidate onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
          {errors.email && <span className="msg_error">*{errors.email}</span>}
          <input
            type="text"
            placeholder="Full Name"
            name="fullName"
            value={user.fullName}
            onChange={handleChange}
          />
          {errors.email && <span className="msg_error">*{errors.fullName}</span>}
          <input
            type="number"
            placeholder="Phone"
            name="phone"
            value={user.phone}
            onChange={handleChange}
          />
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
                {user.showPassword ? <Visibility /> : <VisibilityOff />} <Password />
              </span>
            }
          />
          {errors.password && <span className="msg_error">*{errors.password}</span>}

          <Input
            id="standard-adornment-password"
            className="input_show"
            name="confirmPassword"
            type={user.showPassword ? 'text' : 'password'}
            value={user.confirmPassword}
            onChange={handleChange}
            endAdornment={
              <span
                className="show_pw"
                aria-label="toggle password visibility"
                onClick={() => setUser({ ...user, showPassword: !user.showPassword })}
                onMouseDown={e => e.preventDefault()}>
                {user.showPassword ? <Visibility /> : <VisibilityOff />} <EnhancedEncryptionSharp />
              </span>
            }
          />
          {errors.password && <span className="msg_error">*{errors.confirmPassword}</span>}

          <div style={{ textAlign: 'center' }}>
            <button type="submit">Sign Up</button>
          </div>
        </form>
        <Link href={pathParams.SIGNIN}>You have account</Link>
      </div>
    </div>
  );
};

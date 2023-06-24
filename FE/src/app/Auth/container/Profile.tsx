/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Container, Grid } from '@mui/material';
import { useInjectReducer, useInjectSaga } from 'store/core/@reduxjs/redux-injectors';
import { AuthSaga } from 'store/auth/shared/saga';
import * as AuthSlice from 'store/auth/shared/slice';
import * as AuthSelector from 'store/auth/shared/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { Unsubscribe } from 'redux';
import { RootStore } from 'store/configStore';
import { toast } from 'react-toastify';
import { Loading } from 'commom/loading';
import { CardProfile } from '../component/CardProfile';
import { CardShops } from '../component/CardShops';

export const Profile = () => {
  const dispatch = useDispatch();
  const loading = useSelector(AuthSelector.selectLoading);

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
        case AuthSlice.actions.updateProfileSuccess.type:
          dispatch(AuthSlice.actions.getUserById());
          toast.success(payload.message);
          resetData();
          break;
        case AuthSlice.actions.uploadFileSuccess.type:
          toast.success(payload.message);
          if (payload && payload.data.length) {
            const data = { avatar: payload.data[0] };
            dispatch(AuthSlice.actions.updateProfile(data));
          }
          break;
        case AuthSlice.actions.updateProfileFail.type:
        case AuthSlice.actions.uploadFileFail.type:
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

  const resetData = () => {};

  return (
    <Container sx={{ margin: '20px 0' }}>
      <Grid container spacing={2} columns={{ xs: 6, sm: 12, md: 12 }}>
        {loading && <Loading />}
        <CardProfile resetData={resetData} />
        <CardShops />
      </Grid>
    </Container>
  );
};

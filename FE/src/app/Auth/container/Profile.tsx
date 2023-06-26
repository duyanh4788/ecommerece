/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import { Container, Grid } from '@mui/material';
import { useInjectReducer, useInjectSaga } from 'store/core/@reduxjs/redux-injectors';
import { AuthSaga } from 'store/auth/shared/saga';
import { ShopSaga } from 'store/shops/shared/saga';
import * as AuthSlice from 'store/auth/shared/slice';
import * as AuthSelector from 'store/auth/shared/selectors';
import * as ShopSlice from 'store/shops/shared/slice';
import { useDispatch, useSelector } from 'react-redux';
import { Unsubscribe } from 'redux';
import { RootStore } from 'store/configStore';
import { toast } from 'react-toastify';
import { Loading } from 'commom/loading';
import { CardProfile } from '../component/CardProfile';
import { CardShops } from '../component/CardShops';
import { CardHistory } from '../component/CardHistory';

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

  useInjectReducer({
    key: ShopSlice.sliceKey,
    reducer: ShopSlice.reducer,
  });
  useInjectSaga({
    key: ShopSlice.sliceKey,
    saga: ShopSaga,
  });
  const resetDataRef = useRef<boolean | null>(false);
  useEffect(() => {
    const storeSub$: Unsubscribe = RootStore.subscribe(() => {
      const { type, payload } = RootStore.getState().lastAction;
      switch (type) {
        case AuthSlice.actions.updateProfileSuccess.type:
          dispatch(AuthSlice.actions.getUserById());
          toast.success(payload.message);
          handleResetData();
          break;
        case ShopSlice.actions.updatedShopSuccess.type:
        case ShopSlice.actions.deletedShopSuccess.type:
        case ShopSlice.actions.registedShopSuccess.type:
          dispatch(ShopSlice.actions.getListsShop());
          dispatch(ShopSlice.actions.clearUrl());
          toast.success(payload.message);
          handleResetData();
          break;
        case AuthSlice.actions.uploadFileSuccess.type:
          toast.success(payload.message);
          if (payload && payload.data.length) {
            const data = { avatar: payload.data[0] };
            dispatch(AuthSlice.actions.updateProfile(data));
          }
          break;
        case ShopSlice.actions.uploadFileSuccess.type:
          toast.success(payload.message);
          break;
        case ShopSlice.actions.registedShopFail.type:
        case ShopSlice.actions.updatedShopFail.type:
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
      handleResetData();
    };
  }, []);

  const handleResetData = () => {
    if (resetDataRef.current !== undefined) {
      resetDataRef.current = true;
    }
  };

  return (
    <Container sx={{ margin: '20px auto' }}>
      <Grid container spacing={2} columns={{ xs: 6, sm: 12, md: 12 }}>
        {loading && <Loading />}
        <CardProfile resetDataRef={resetDataRef} />
        <CardHistory resetDataRef={resetDataRef} />
        <CardShops resetDataRef={resetDataRef} />
      </Grid>
    </Container>
  );
};

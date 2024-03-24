/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import { Box, Grid, Paper } from '@mui/material';
import * as AuthSlice from 'store/auth/shared/slice';
import * as AuthSelector from 'store/auth/shared/selectors';
import * as ShopSlice from 'store/shops/shared/slice';
import * as ShopSelector from 'store/shops/shared/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { Unsubscribe } from 'redux';
import { RootStore } from 'store/configStore';
import { toast } from 'react-toastify';
import { Loading } from 'commom/loading';
import { CardProfile } from '../component/CardProfile';
import { CardListShops } from '../component/CardListShops';
import { BG_MAIN_1 } from 'commom/common.contants';

export const Profile = () => {
  const dispatch = useDispatch();
  const loadingAuth = useSelector(AuthSelector.selectLoading);
  const loadingShop = useSelector(ShopSelector.selectLoading);
  const resetDataRefProfile = useRef<boolean | null>(false);
  const resetDataRefListShop = useRef<boolean | null>(false);

  useEffect(() => {
    dispatch(ShopSlice.actions.getListsShop());

    const storeSub$: Unsubscribe = RootStore.subscribe(() => {
      const { type, payload } = RootStore.getState().lastAction;
      switch (type) {
        case AuthSlice.actions.updateProfileSuccess.type:
          dispatch(AuthSlice.actions.getUserById());
          toast.success(payload.message);
          handleResetDataProfile();

          break;
        case ShopSlice.actions.deletedShopSuccess.type:
        case ShopSlice.actions.registedShopSuccess.type:
          dispatch(ShopSlice.actions.getListsShop());
          dispatch(ShopSlice.actions.clearUrl());
          toast.success(payload.message);
          handleResetDataShops();
          break;
        case AuthSlice.actions.uploadFileSuccess.type:
          toast.success(payload.message);
          if (payload && payload.data.length) {
            const data = { avatar: payload.data[0] };
            dispatch(AuthSlice.actions.updateProfile(data));
            dispatch(AuthSlice.actions.clearUrl());
          }
          break;
        case ShopSlice.actions.uploadFileSuccess.type:
          toast.success(payload.message);
          break;
        case ShopSlice.actions.registedShopFail.type:
        case ShopSlice.actions.deletedShopFail.type:
        case ShopSlice.actions.uploadFileFail.type:
        case AuthSlice.actions.updateProfileFail.type:
        case AuthSlice.actions.uploadFileFail.type:
        case AuthSlice.actions.removeFileFail.type:
          toast.error(payload.message);
          break;
        default:
          break;
      }
    });
    return () => {
      storeSub$();
      handleResetDataProfile();
      handleResetDataShops();
      dispatch(AuthSlice.actions.clearData());
    };
  }, []);

  const handleResetDataProfile = () => {
    if (resetDataRefProfile.current !== undefined) {
      resetDataRefProfile.current = true;
    }
  };

  const handleResetDataShops = () => {
    if (resetDataRefListShop.current !== undefined) {
      resetDataRefListShop.current = true;
    }
  };

  return (
    <Paper sx={{ background: 'none', margin: '20px' }}>
      {loadingAuth || loadingShop ? <Loading /> : null}
      <Box height={'100%'} bgcolor={BG_MAIN_1} padding={'10px'} borderRadius={'5px'}>
        <Grid container columns={{ xs: 6, sm: 12, md: 12 }} spacing={2}>
          <CardProfile resetDataRef={resetDataRefProfile} />
          <CardListShops resetDataRef={resetDataRefListShop} />
        </Grid>
      </Box>
    </Paper>
  );
};

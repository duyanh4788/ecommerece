/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Box, Paper } from '@mui/material';
import { useInjectReducer, useInjectSaga } from 'store/core/@reduxjs/redux-injectors';
import { AuthSaga } from 'store/auth/shared/saga';
import { ShopSaga } from 'store/shops/shared/saga';
import * as AuthSlice from 'store/auth/shared/slice';
import * as AuthSelector from 'store/auth/shared/selectors';
import * as ShopSlice from 'store/shops/shared/slice';
import * as ShopSelector from 'store/shops/shared/selectors';
import * as SubscriptionSlice from 'store/subscription/shared/slice';
import * as SubscriptionSelector from 'store/subscription/shared/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { Unsubscribe } from 'redux';
import { RootStore } from 'store/configStore';
import { toast } from 'react-toastify';
import { Loading } from 'commom/loading';
import { CardProfile } from '../component/CardProfile';
import { CardShops } from '../component/CardShops';
import { CardHistory } from '../component/CardHistory';
import { AccountBox, Bookmark, Store } from '@mui/icons-material';
import { SubscriptionSaga } from 'store/subscription/shared/saga';

const PAGE = {
  PROFILLE: 'PROFILLE',
  SHOP: 'SHOP',
  HISTORY: 'HISTORY',
};

export const Profile = () => {
  const dispatch = useDispatch();
  const loadingAuth = useSelector(AuthSelector.selectLoading);
  const loadingShop = useSelector(ShopSelector.selectLoading);
  const loadingSubs = useSelector(SubscriptionSelector.selectLoading);
  const [selectedTab, setSelectedTab] = useState(PAGE.PROFILLE);

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

  useInjectReducer({
    key: SubscriptionSlice.sliceKey,
    reducer: SubscriptionSlice.reducer,
  });
  useInjectSaga({
    key: SubscriptionSlice.sliceKey,
    saga: SubscriptionSaga,
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
        case SubscriptionSlice.actions.userCanceledSuccess.type:
          toast.success(payload.message);
          handleResetData();
          break;
        case ShopSlice.actions.registedShopFail.type:
        case ShopSlice.actions.updatedShopFail.type:
        case AuthSlice.actions.updateProfileFail.type:
        case AuthSlice.actions.uploadFileFail.type:
        case SubscriptionSlice.actions.userCanceledFail.type:
          toast.error(payload.message);
          break;
        default:
          break;
      }
    });
    return () => {
      storeSub$();
      dispatch(AuthSlice.actions.clearData());
      dispatch(SubscriptionSlice.actions.clearData());
      dispatch(SubscriptionSlice.actions.clearSubscription());
      dispatch(SubscriptionSlice.actions.clearLinks());
      dispatch(SubscriptionSlice.actions.clearInvoices());
      handleResetData();
    };
  }, []);

  const handleResetData = () => {
    if (resetDataRef.current !== undefined) {
      resetDataRef.current = true;
    }
  };

  return (
    <Paper sx={{ background: 'none', margin: '20px' }}>
      {loadingAuth || loadingShop || loadingSubs ? <Loading /> : null}
      <BottomNavigation
        sx={{ background: '#d6cfc9', marginBottom: '5px' }}
        showLabels
        value={selectedTab}
        onChange={(e, newValue) => setSelectedTab(newValue)}>
        <BottomNavigationAction value={PAGE.PROFILLE} label="Profile" icon={<AccountBox />} />
        <BottomNavigationAction value={PAGE.SHOP} label="Shops" icon={<Store />} />
        <BottomNavigationAction value={PAGE.HISTORY} label="History" icon={<Bookmark />} />
      </BottomNavigation>
      <Box height={'100%'} bgcolor={'#d6cfc9'} padding={'10px'} borderRadius={'5px'}>
        {selectedTab === PAGE.PROFILLE && <CardProfile resetDataRef={resetDataRef} />}
        {selectedTab === PAGE.SHOP && <CardShops resetDataRef={resetDataRef} />}
        {selectedTab === PAGE.HISTORY && <CardHistory resetDataRef={resetDataRef} />}
      </Box>
    </Paper>
  );
};

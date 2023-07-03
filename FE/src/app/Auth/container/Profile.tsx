/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Box, Paper } from '@mui/material';
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
import { BG_MAIN_1, PATH_PARAMS } from 'commom/common.contants';
import { useLocation, useNavigate } from 'react-router-dom';
import { localStorage } from 'hooks/localStorage/LocalStorage';
import { LocalStorageKey, TypeLocal } from 'services/localStorage';

const PAGE = {
  PROFILLE: 'PROFILLE',
  SHOP: 'SHOP',
  HISTORY: 'HISTORY',
};

export const Profile = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const tabs = localStorage(TypeLocal.GET, LocalStorageKey.tabs);
  const loadingAuth = useSelector(AuthSelector.selectLoading);
  const loadingShop = useSelector(ShopSelector.selectLoading);
  const loadingSubs = useSelector(SubscriptionSelector.selectLoading);
  const [selectedTab, setSelectedTab] = useState(tabs || PAGE.PROFILLE);
  const resetDataRef = useRef<boolean | null>(false);

  useEffect(() => {
    function initUrl(url) {
      const { pathname, search } = url;
      if (!search.includes('notification')) return;
      const decode = decodeURIComponent(search).replaceAll('%20', ' ');
      toast.success(decode.split('=')[1]);
      navigate(pathname, { replace: true });
    }
    initUrl(location);
  }, [location]);

  useEffect(() => {
    const storeSub$: Unsubscribe = RootStore.subscribe(() => {
      const { type, payload } = RootStore.getState().lastAction;
      switch (type) {
        case AuthSlice.actions.updateProfileSuccess.type:
          dispatch(AuthSlice.actions.getUserById());
          toast.success(payload.message);
          handleResetData();
          break;
        case AuthSlice.actions.signOutSuccess.type:
          toast.success(payload.message);
          handleResetData();
          navigate(PATH_PARAMS.SIGNIN);
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
        sx={{ background: BG_MAIN_1, marginBottom: '5px' }}
        showLabels
        value={selectedTab}
        onChange={(e, newValue) => {
          setSelectedTab(newValue);
          localStorage(TypeLocal.SET, LocalStorageKey.tabs, newValue);
        }}>
        <BottomNavigationAction value={PAGE.PROFILLE} label="Profile" icon={<AccountBox />} />
        <BottomNavigationAction value={PAGE.SHOP} label="Shops" icon={<Store />} />
        <BottomNavigationAction value={PAGE.HISTORY} label="History" icon={<Bookmark />} />
      </BottomNavigation>
      <Box height={'100%'} bgcolor={BG_MAIN_1} padding={'10px'} borderRadius={'5px'}>
        {selectedTab === PAGE.SHOP && <CardShops resetDataRef={resetDataRef} />}
        {selectedTab === PAGE.PROFILLE && <CardProfile resetDataRef={resetDataRef} />}
        {selectedTab === PAGE.HISTORY && <CardHistory resetDataRef={resetDataRef} />}
      </Box>
    </Paper>
  );
};

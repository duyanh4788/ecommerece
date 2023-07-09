/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as ShopSlice from 'store/shops/shared/slice';
import * as ShopSelector from 'store/shops/shared/selectors';
import * as SubscriptionSlice from 'store/subscription/shared/slice';
import * as SubscriptionSelector from 'store/subscription/shared/selectors';
import * as ItemSlice from 'store/items/shared/slice';
import * as ItemSelector from 'store/items/shared/selectors';
import { Divider, Grid, IconButton, Paper } from '@mui/material';
import { PATH_PARAMS } from 'commom/common.contants';
import { Loading } from 'commom/loading';
import { localStorage } from 'hooks/localStorage/LocalStorage';
import { LocalStorageKey, TypeLocal } from 'services/localStorage';
import { Undo } from '@mui/icons-material';
import { SlidersShop } from '../component/SlidersShop';
import { CardShop } from '../component/CardShop';
import { CardSubscriptions } from '../component/CardSubscriptions';
import { CardItem } from '../component/CardItem';
import { Unsubscribe } from 'redux';
import { RootStore } from 'store/configStore';
import { toast } from 'react-toastify';

export const ManagerShop = () => {
  const dispatch = useDispatch();
  const shopId = localStorage(TypeLocal.GET, LocalStorageKey.shopId);
  const navigate = useNavigate();
  const loadingShop = useSelector(ShopSelector.selectLoading);
  const shopInfor = useSelector(ShopSelector.selectShopInfor);
  const loadingSubs = useSelector(SubscriptionSelector.selectLoading);
  const loadingItems = useSelector(ItemSelector.selectLoading);
  const resetDataRefSubs = useRef<boolean | null>(false);
  const resetDataRefShop = useRef<boolean | null>(false);
  const statusRefSlider = useRef<boolean | null>(false);
  const resetDataRefItems = useRef<boolean | null>(false);
  const urlRefShop = useRef<string | null>(null);

  useEffect(() => {
    function initShop(id) {
      if (!id) {
        navigate(PATH_PARAMS.PROFILE);
        return;
      }
      dispatch(ShopSlice.actions.getShopById(id));
      dispatch(ShopSlice.actions.prodGetLists());
      dispatch(SubscriptionSlice.actions.shopGetSubscription(id));
      dispatch(SubscriptionSlice.actions.getPlans());
      dispatch(SubscriptionSlice.actions.shopGetInvoices(id));
      dispatch(ItemSlice.actions.getListsItems({ id }));
    }
    initShop(shopId);

    const storeSub$: Unsubscribe = RootStore.subscribe(() => {
      const { type, payload } = RootStore.getState().lastAction;
      switch (type) {
        case ShopSlice.actions.updatedShopSuccess.type:
        case ShopSlice.actions.updatedSlidersSuccess.type:
          dispatch(ShopSlice.actions.getShopById(shopId));
          urlRefShop.current = null;
          handleStatusUploadSliders(false);
          handleResetDataShop();
          break;
        case ShopSlice.actions.deletedShopSuccess.type:
          toast.success(payload.message);
          localStorage(TypeLocal.REMOVE, LocalStorageKey.shopId);
          navigate(PATH_PARAMS.PROFILE);
          break;
        case ShopSlice.actions.uploadFileSuccess.type:
          toast.success(payload.message);
          if (urlRefShop.current === null) {
            urlRefShop.current = payload.data[0];
          }
          if (payload && payload.data.length && statusRefSlider.current === true) {
            const result = {
              id: shopId,
              sliders: payload.data,
            };
            dispatch(ShopSlice.actions.updatedSliders(result));
          }
          break;
        case SubscriptionSlice.actions.shopCanceledSuccess.type:
          toast.success(payload.message);
          handleResetDataSubs();
          break;
        case ShopSlice.actions.updatedShopFail.type:
        case ShopSlice.actions.uploadFileFail.type:
        case ShopSlice.actions.updatedSlidersFail.type:
        case ShopSlice.actions.deletedShopFail.type:
        case SubscriptionSlice.actions.shopCanceledFail.type:
        case ItemSlice.actions.uploadFileFail.type:
        case ItemSlice.actions.deletedItemFail.type:
        case ItemSlice.actions.createdItemFail.type:
        case ItemSlice.actions.updatedItemFail.type:
        case ItemSlice.actions.updatedThumbFail.type:
          toast.error(payload.message);
          break;
        case ItemSlice.actions.createdItemSuccess.type:
        case ItemSlice.actions.updatedItemSuccess.type:
        case ItemSlice.actions.deletedItemSuccess.type:
          toast.success(payload.message);
          handleResetDataItems();
          dispatch(ItemSlice.actions.clearUrl());
          break;
        case ItemSlice.actions.uploadFileSuccess.type:
          toast.success(payload.message);
          break;
        case ItemSlice.actions.updatedThumbSuccess.type:
          toast.success(payload.message);
          dispatch(ItemSlice.actions.getItemById(payload.data.id));
          break;
        default:
          break;
      }
    });
    return () => {
      storeSub$();
      dispatch(ShopSlice.actions.clearData());
      dispatch(SubscriptionSlice.actions.clearData());
      dispatch(ItemSlice.actions.clearData());
      dispatch(ItemSlice.actions.clearListItems());
      dispatch(ItemSlice.actions.clearItem());
    };
  }, []);

  const handleResetDataShop = () => {
    if (resetDataRefShop.current !== undefined) {
      resetDataRefShop.current = true;
    }
  };

  const handleResetDataSubs = () => {
    if (resetDataRefSubs.current !== undefined) {
      resetDataRefSubs.current = true;
    }
  };

  const handleStatusUploadSliders = (status: boolean) => {
    if (statusRefSlider.current !== undefined) {
      statusRefSlider.current = status;
    }
  };

  const handleResetDataItems = () => {
    if (resetDataRefItems.current !== undefined) {
      resetDataRefItems.current = true;
    }
  };

  return (
    <Paper className="manager_shop">
      {loadingShop || loadingSubs || loadingItems ? <Loading /> : null}
      <IconButton onClick={() => navigate(-1)}>
        <Undo />
      </IconButton>
      <Grid container columns={{ xs: 6, sm: 12, md: 12 }} spacing={2}>
        <CardShop
          shopInfor={shopInfor}
          resetDataRefShop={resetDataRefShop}
          urlRefShop={urlRefShop}
        />
        <CardSubscriptions shopInfor={shopInfor} resetDataRefSubs={resetDataRefSubs} />
      </Grid>
      <SlidersShop shopInfor={shopInfor} handleStatusUploadSliders={handleStatusUploadSliders} />
      <Divider />
      <CardItem shopInfor={shopInfor} resetDataRefItems={resetDataRefItems} />
    </Paper>
  );
};

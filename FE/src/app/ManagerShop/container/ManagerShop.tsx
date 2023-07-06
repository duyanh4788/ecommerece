/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as ShopSlice from 'store/shops/shared/slice';
import * as ShopSelector from 'store/shops/shared/selectors';
import * as SubscriptionSlice from 'store/subscription/shared/slice';
import * as SubscriptionSelector from 'store/subscription/shared/selectors';
import { Grid, IconButton, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { PATH_PARAMS } from 'commom/common.contants';
import { Loading } from 'commom/loading';
import { localStorage } from 'hooks/localStorage/LocalStorage';
import { LocalStorageKey, TypeLocal } from 'services/localStorage';
import { Undo } from '@mui/icons-material';
import { SlidersShop } from '../component/SlidersShop';
import { CardShop } from '../component/CardShop';
import { CardSubscriptions } from '../component/CardSubscriptions';

export const ManagerShop = () => {
  const dispatch = useDispatch();
  const shopId = localStorage(TypeLocal.GET, LocalStorageKey.shopId);
  const navigate = useNavigate();
  const loadingShop = useSelector(ShopSelector.selectLoading);
  const loadingSubs = useSelector(SubscriptionSelector.selectLoading);
  const shopInfor = useSelector(ShopSelector.selectShopInfor);
  const [alignment, setAlignment] = React.useState<string | null>('ALL');
  const [eventPage, setEventPage] = useState<string | null>(null);

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
    }
    initShop(shopId);
    return () => {
      dispatch(ShopSlice.actions.clearData());
      dispatch(SubscriptionSlice.actions.clearData());
    };
  }, [shopId]);

  return (
    <Paper className="manager_shop">
      {loadingShop || loadingSubs ? <Loading /> : null}
      <IconButton onClick={() => navigate(-1)}>
        <Undo />
      </IconButton>
      <Grid container columns={{ xs: 6, sm: 12, md: 12 }} spacing={2}>
        <CardShop shopInfor={shopInfor} handleEvent={setEventPage} PAGE={eventPage} />
        <CardSubscriptions shopInfor={shopInfor} />
      </Grid>
      <SlidersShop shopInfor={shopInfor} handleEvent={setEventPage} PAGE={eventPage} />
      <ToggleButtonGroup
        color="success"
        value={alignment}
        exclusive
        onChange={(e, newAlignment) => setAlignment(newAlignment)}
        aria-label="Platform">
        <ToggleButton
          value={'ALL'}
          sx={{
            borderRadius: '50% !important',
            marginRight: '5px',
            marginLeft: '0 !important',
          }}>
          All
        </ToggleButton>
        {shopInfor?.prodcutSell?.map((item, idx) => (
          <ToggleButton
            key={idx}
            value={item.id}
            sx={{
              borderRadius: '20px !important',
              marginRight: '5px',
              marginLeft: '0 !important',
              border: '1px solid rgba(0, 0, 0, 0.12) !important',
            }}>
            {item.nameProduct}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Paper>
  );
};

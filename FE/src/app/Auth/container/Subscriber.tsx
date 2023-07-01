/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Box, Card, CardContent, Fab, Link, Tooltip, Typography } from '@mui/material';
import * as SubscriptionSlice from 'store/subscription/shared/slice';
import * as SubscriptionSelector from 'store/subscription/shared/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'store/core/@reduxjs/redux-injectors';
import { SubscriptionSaga } from 'store/subscription/shared/saga';
import { LocalStorageKey, TypeLocal } from 'services/localStorage';
import { useNavigate } from 'react-router-dom';
import { FREE_TRIAL, PATH_PARAMS, PAYPAL_LOGO, PAYPAL_SUBS } from 'commom/common.contants';
import { AppHelper } from 'utils/app.helper';
import { AttachMoney } from '@mui/icons-material';
import { handleColorTier } from 'utils/color';
import { TypeSubscriber } from 'interface/Subscriptions.model';
import { Loading } from 'commom/loading';
import { toast } from 'react-toastify';
import { Unsubscribe } from 'redux';
import { RootStore } from 'store/configStore';
import { localStorage } from 'hooks/localStorage/LocalStorage';

export const Subscriber = () => {
  const planUser = localStorage(TypeLocal.GET, LocalStorageKey.tier);
  const loading = useSelector(SubscriptionSelector.selectLoading);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useInjectReducer({
    key: SubscriptionSlice.sliceKey,
    reducer: SubscriptionSlice.reducer,
  });
  useInjectSaga({
    key: SubscriptionSlice.sliceKey,
    saga: SubscriptionSaga,
  });

  useEffect(() => {
    function initData(plan) {
      if (!plan) {
        navigate(PATH_PARAMS.PROFILE);
        return;
      }
    }
    initData(planUser);
  }, [planUser]);

  useEffect(() => {
    const storeSub$: Unsubscribe = RootStore.subscribe(() => {
      const { type, payload } = RootStore.getState().lastAction;
      switch (type) {
        case SubscriptionSlice.actions.userSubscriberSuccess.type:
        case SubscriptionSlice.actions.userChangedSuccess.type:
          window.location.replace(payload.data);
          break;
        case SubscriptionSlice.actions.userSubscriberFail.type:
        case SubscriptionSlice.actions.userChangedFail.type:
          toast.error(payload.message);
          break;
        default:
          break;
      }
    });
    return () => {
      storeSub$();
      localStorage(TypeLocal.REMOVE, LocalStorageKey.tier);
      dispatch(SubscriptionSlice.actions.clearData());
    };
  }, []);

  const handleSubscriber = () => {
    if (planUser?.type === TypeSubscriber.SUBSCRIBER) {
      dispatch(SubscriptionSlice.actions.userSubscriber({ tier: planUser.tier }));
      return;
    }
    if (planUser?.type === TypeSubscriber.CHANGED) {
      dispatch(SubscriptionSlice.actions.userChanged({ tier: planUser.tier }));
      return;
    }
  };

  return (
    <Box component="div" className="subscriber">
      <Card className="card">
        {loading ? <Loading /> : null}
        <Link style={{ cursor: 'pointer' }} onClick={() => navigate(-1)}>
          Back
        </Link>
        <Box textAlign={'center'}>
          <img src={PAYPAL_LOGO} alt={PAYPAL_LOGO} />
        </Box>
        <CardContent className="card_content">
          <Box>
            <Typography className="tag_p">
              <span>
                FINISH PAYMENT{' '}
                {planUser?.isTrial ? (
                  <Tooltip title="You are on a free trial in 30 days">
                    <img width={'50px'} src={FREE_TRIAL} alt={FREE_TRIAL} />
                  </Tooltip>
                ) : null}
              </span>
            </Typography>

            <Typography textAlign={'center'}>
              <Fab
                aria-label="tier"
                style={{
                  background: 'none',
                  color: handleColorTier(planUser?.tier as string),
                  fontSize: '10px',
                  fontWeight: 'bolder',
                }}>
                {AppHelper.capitalizeFirstLetter(planUser?.tier as string)}
              </Fab>
            </Typography>
            <Typography display={'flex'} alignItems={'center'}>
              Amount: {planUser?.amout} <AttachMoney style={{ fontSize: '13px' }} />
            </Typography>
            <Typography>Billing Date: {AppHelper.formmatDateTime(new Date())}</Typography>
          </Box>
        </CardContent>
        <div className="action">
          <span onClick={handleSubscriber}>
            PAY WITH <img src={PAYPAL_SUBS} alt="PayPal Logo" height="24px" />
          </span>
        </div>
      </Card>
    </Box>
  );
};

/* eslint-disable react-hooks/exhaustive-deps */
import React, { RefObject, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Tooltip,
  Typography,
} from '@mui/material';
import { HelpOutline } from '@mui/icons-material';
import { AppHelper } from 'utils/app.helper';
import { useSelector } from 'react-redux';
import * as AuthSelector from 'store/auth/shared/selectors';
import * as SubscriptionSelector from 'store/subscription/shared/selectors';
import { SubscriptionStatus, TypeSubscriber } from 'interface/Subscriptions.model';
import {
  BG_MAIN_1,
  FREE_TRIAL,
  PAYPAL_LOGO,
  TITLE_ITEM,
  TITLE_SUBS,
  TITLE_WAITING,
  renderTitleResource,
} from 'commom/common.contants';
import { handleColorStatus, handleColorTier } from 'utils/color';
import { ModalCancel } from './ModalCancel';
import { ModalPlans } from './ModalPlans';
import { ModalInvoices } from './ModalInvoices';
import { Shops } from 'interface/Shops.model';

interface Props {
  shopInfor: Shops | null;
  resetDataRefSubs: RefObject<boolean | null>;
}

export const CardSubscriptions = ({ shopInfor, resetDataRefSubs }: Props) => {
  const userInfor = useSelector(AuthSelector.selectUserInfor);
  const plans = useSelector(SubscriptionSelector.selectPlans);
  const invoices = useSelector(SubscriptionSelector.selectInvoices);
  const subscriptions = useSelector(SubscriptionSelector.selectSubscription);
  const [modalPlans, setModalPlans] = useState<boolean>(false);
  const [modalInvoice, setModalInvoice] = useState<boolean>(false);
  const [modalCancel, setModalCancel] = useState<boolean>(false);
  const [typeSubscriber, setTypeSubscriber] = useState<string>(TypeSubscriber.SUBSCRIBER);

  useEffect(() => {
    if (resetDataRefSubs.current) {
      handleResetData();
      const newResetData = false;
      Object.assign(resetDataRefSubs, { current: newResetData });
    }
  }, [resetDataRefSubs.current]);

  const handleResetData = () => {
    setModalPlans(false);
    setModalInvoice(false);
    setModalCancel(false);
    setTypeSubscriber(TypeSubscriber.SUBSCRIBER);
  };

  return (
    <Grid item xs={12} sm={6} md={6}>
      {subscriptions ? (
        <Card className="card_profile" style={{ height: '100%' }}>
          <CardHeader
            title={
              <Typography sx={{ fontWeight: 'bold' }} variant="inherit">
                Tier:{' '}
                <span
                  style={{
                    color: handleColorTier(subscriptions.paypalBillingPlans?.tier as string),
                  }}>
                  {AppHelper.capitalizeFirstLetter(
                    subscriptions.paypalBillingPlans?.tier as string,
                  )}
                </span>
              </Typography>
            }
            action={
              subscriptions.isTrial ? (
                <Tooltip title="You are on a free trial in 30 days">
                  <img width={'50px'} src={FREE_TRIAL} alt={FREE_TRIAL} />
                </Tooltip>
              ) : null
            }
            subheader={AppHelper.formmatDateTime(subscriptions.lastPaymentsFetch)}
          />
          <Box sx={{ background: BG_MAIN_1, textAlign: 'center', padding: '0 10px' }}>
            <img style={{ maxHeight: '100px' }} src={PAYPAL_LOGO} alt={PAYPAL_LOGO} />
          </Box>
          <CardContent sx={{ lineHeight: '35px' }}>
            <Typography variant="inherit">
              Status:{' '}
              <span
                className="status"
                style={{ color: handleColorStatus(subscriptions.status as string) }}>
                {subscriptions.status?.split('_').join(' ')}
              </span>
              {subscriptions.status === 'WAITING_SYNC' ? (
                <Tooltip title={TITLE_WAITING}>
                  <HelpOutline sx={{ fontSize: '12px' }} color="success" />
                </Tooltip>
              ) : null}
            </Typography>
            <Typography variant="inherit">
              Resouce Product: {subscriptions.shopsResources?.numberProduct}{' '}
              <Tooltip
                title={
                  subscriptions.shopsResources
                    ? renderTitleResource(subscriptions.paypalBillingPlans?.numberProduct as number)
                    : TITLE_SUBS
                }>
                <HelpOutline sx={{ fontSize: '12px' }} color="success" />
              </Tooltip>
            </Typography>
            <Typography variant="inherit">
              Resouce Item:{' '}
              {subscriptions.shopsResources
                ? `${subscriptions.shopsResources?.numberItem}/month`
                : null}
              <Tooltip title={subscriptions.shopsResources ? TITLE_ITEM : TITLE_SUBS}>
                <HelpOutline sx={{ fontSize: '12px' }} color="success" />
              </Tooltip>
            </Typography>
            <Chip
              label="Invoices"
              color="success"
              variant="outlined"
              size="small"
              sx={{ cursor: 'pointer' }}
              onClick={() => setModalInvoice(true)}
            />
          </CardContent>
          <CardActions className="subs">
            {subscriptions.status === SubscriptionStatus.ACTIVE ? (
              <Button className="btn_unsub" onClick={() => setModalCancel(true)}>
                UnSubscribe
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setModalPlans(true);
                  setTypeSubscriber(TypeSubscriber.SUBSCRIBER);
                }}>
                Subscribe
              </Button>
            )}
            {subscriptions.status === SubscriptionStatus.ACTIVE ||
            subscriptions.status === SubscriptionStatus.APPROVAL_PENDING ? (
              <Button
                className="btn_change"
                onClick={() => {
                  setModalPlans(true);
                  setTypeSubscriber(TypeSubscriber.CHANGED);
                }}>
                Changed
              </Button>
            ) : null}
          </CardActions>
        </Card>
      ) : (
        <div className="box_subs">
          <Box>
            <Typography>30 DAYS ACCESS TO ALL FEATURES on your selected subscription.</Typography>
            <Typography>Change and/or cancel your subscription at any time</Typography>
            <Button
              onClick={() => {
                setModalPlans(true);
                setTypeSubscriber(TypeSubscriber.SUBSCRIBER);
              }}>
              Subscribe
            </Button>
          </Box>
        </div>
      )}
      {modalPlans ? (
        <ModalPlans
          shopId={shopInfor?.id}
          plans={plans}
          subscriptions={subscriptions}
          modalPlans={modalPlans}
          handleClose={setModalPlans}
          typeSubscriber={typeSubscriber}
        />
      ) : null}
      {modalInvoice ? (
        <ModalInvoices
          modalInvoice={modalInvoice}
          handleClose={setModalInvoice}
          invoices={invoices}
          userInfor={userInfor}
        />
      ) : null}
      {modalCancel ? (
        <ModalCancel
          shopId={shopInfor?.id}
          modalCancel={modalCancel}
          handleClose={setModalCancel}
          subscriptionId={subscriptions?.subscriptionId as string}
        />
      ) : null}
    </Grid>
  );
};

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  Tooltip,
} from '@mui/material';
import {
  PaypalBillingPlans,
  Subscription,
  SubscriptionStatus,
  TypeSubscriber,
} from 'interface/Subscriptions.model';
import { handleColorTier } from 'utils/color';
import {
  PATH_PARAMS,
  PAYPAL_BANNER,
  PAYPAL_SUBS,
  TITLE_CHANGED,
  renderTitleResource,
} from 'commom/common.contants';
import { LocalStorageKey, TypeLocal } from 'services/localStorage';
import { useNavigate } from 'react-router-dom';
import { AppHelper } from 'utils/app.helper';
import { HelpOutline, NoteAlt } from '@mui/icons-material';
import { localStorage } from 'hooks/localStorage/LocalStorage';
interface Props {
  modalPlans: boolean;
  plans: PaypalBillingPlans[];
  subscriptions: Subscription | null;
  typeSubscriber: string;
  handleClose: (e: boolean) => void;
}

export const ModalPlans = ({
  plans,
  subscriptions,
  modalPlans,
  typeSubscriber,
  handleClose,
}: Props) => {
  const navigate = useNavigate();

  const handleSubscriber = (item: any) => {
    const value = {
      tier: item.tier.split('_')[0],
      amout: item.amount,
      isTrial: subscriptions?.isTrial,
      type:
        typeSubscriber === TypeSubscriber.SUBSCRIBER
          ? TypeSubscriber.SUBSCRIBER
          : TypeSubscriber.CHANGED,
    };
    localStorage(TypeLocal.SET, LocalStorageKey.tier, value);
    navigate(PATH_PARAMS.SUBSCRIBER);
  };

  return (
    <Dialog
      open={modalPlans}
      onClose={() => handleClose(false)}
      maxWidth={'xl'}
      className="modal_plans">
      <Box className="box_1">
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          Plans Paypal Ecommerce AnhVu{' '}
          {typeSubscriber === TypeSubscriber.CHANGED ? (
            <Tooltip title={TITLE_CHANGED}>
              <NoteAlt sx={{ fontSize: '15px' }} color="success" />
            </Tooltip>
          ) : null}
        </DialogTitle>
        <img src={PAYPAL_BANNER} alt={PAYPAL_BANNER} />
      </Box>
      <DialogContent className="dglog_conntent">
        <Box className="box_2">
          {plans.map(item => {
            return (
              <Card key={item.planId} className="card">
                <CardContent>
                  <Box className="box_fab">
                    <Fab
                      aria-label="tier"
                      className="fab"
                      style={{
                        color: handleColorTier(item?.tier as string),
                      }}>
                      {AppHelper.capitalizeFirstLetter(item?.tier as string)}
                      {subscriptions
                        ? subscriptions.paypalBillingPlans?.tier?.split('_')[0] === item.tier && (
                            <CircularProgress
                              size={60}
                              sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                height: '0 px !important',
                                zIndex: 1,
                                color: handleColorTier(item?.tier as string),
                              }}
                            />
                          )
                        : null}
                    </Fab>
                  </Box>
                  <Chip
                    label={`Amount: ${item?.amount}$`}
                    variant="outlined"
                    color="success"
                    size="small"
                  />
                  <Chip
                    label={`Product: ${item?.numberProduct}`}
                    variant="outlined"
                    color="info"
                    size="small"
                    icon={
                      <Tooltip title={renderTitleResource(item?.numberProduct as number)}>
                        <HelpOutline sx={{ fontSize: '5px' }} color="success" />
                      </Tooltip>
                    }
                  />
                  <Chip
                    label={`Item: ${item?.numberIndex}/month`}
                    variant="outlined"
                    color="warning"
                    size="small"
                    icon={
                      <Tooltip title={`Every monthly system has reset Item`}>
                        <HelpOutline sx={{ fontSize: '5px' }} color="success" />
                      </Tooltip>
                    }
                  />
                </CardContent>
                <div className="action">
                  {!subscriptions ||
                  subscriptions.status !== SubscriptionStatus.ACTIVE ||
                  subscriptions.paypalBillingPlans?.tier?.split('_')[0] !== item.tier ? (
                    <span onClick={() => handleSubscriber(item)}>
                      PAY WITH <img src={PAYPAL_SUBS} alt="PayPal Logo" height="15px" />
                    </span>
                  ) : null}
                </div>
              </Card>
            );
          })}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

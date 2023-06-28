import React from 'react';
import { Box, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { PaypalBillingPlans, Subscription, TypeSubscriber } from 'interface/Subscriptions.model';
import { handleColorTier } from 'utils/color';
import { AttachMoney, Check } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import * as SubscriptionSlice from 'store/subscription/shared/slice';
import { PAYPAL_BANNER } from 'commom/common.contants';

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
  const dispatch = useDispatch();

  const handleSubscriber = (item: string) => {
    if (typeSubscriber === TypeSubscriber.SUBSCRIBER) {
      dispatch(SubscriptionSlice.actions.userSubscriber({ tier: item }));
      return;
    }
    if (typeSubscriber === TypeSubscriber.CHANGED) {
      dispatch(SubscriptionSlice.actions.userChanged({ tier: item }));
      return;
    }
  };
  const columns: GridColDef[] = [
    {
      field: 'tier',
      headerName: 'Tier',
      align: 'center',
      headerAlign: 'center',
      renderCell: item => (
        <span
          className="cell_tier"
          style={{ color: handleColorTier(item.value) }}
          onClick={() => handleSubscriber(item.value)}>
          {item.value}{' '}
          {subscriptions && subscriptions.paypalBillingPlans?.tier === item.value && <Check />}
        </span>
      ),
    },
    {
      field: 'amount',
      headerName: 'Prices',
      align: 'center',
      headerAlign: 'center',
      renderCell: item => (
        <Box display={'flex'} alignItems={'center'}>
          {item.value}
          <AttachMoney style={{ fontSize: '13px' }} />
        </Box>
      ),
    },
    {
      field: 'numberProduct',
      headerName: 'Number Product',
      align: 'center',
      headerAlign: 'center',
      width: 150,
    },
    {
      field: 'numberIndex',
      headerName: 'Number Index',
      align: 'center',
      headerAlign: 'center',
      width: 150,
    },
  ];

  const getRowId = (row: any) => row.planId;

  return (
    <Dialog open={modalPlans} onClose={() => handleClose(false)} maxWidth={'xl'}>
      <Box display={'flex'} justifyContent={'space-between'}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Plans Paypal Ecommerce AnhVu</DialogTitle>
        <img src={PAYPAL_BANNER} alt={PAYPAL_BANNER} />
      </Box>
      <DialogContent>
        <DataGrid
          rows={plans}
          columns={columns}
          getRowId={getRowId}
          hideFooter={true}
          disableColumnMenu={true}
        />
      </DialogContent>
    </Dialog>
  );
};

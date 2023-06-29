import React from 'react';
import { Box, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { PaypalBillingPlans, Subscription, TypeSubscriber } from 'interface/Subscriptions.model';
import { handleColorTier } from 'utils/color';
import { AttachMoney, Check } from '@mui/icons-material';
import { PATH_PARAMS, PAYPAL_BANNER } from 'commom/common.contants';
import { LocalStorageKey, LocalStorageService } from 'services/localStorage';
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
  const local = new LocalStorageService();

  const handleSubscriber = (item: any) => {
    const value = {
      tier: item.row.tier.split('_')[0],
      amout: item.row.amount,
      isTrial: subscriptions?.isTrial,
      type:
        typeSubscriber === TypeSubscriber.SUBSCRIBER
          ? TypeSubscriber.SUBSCRIBER
          : TypeSubscriber.CHANGED,
    };
    local.setItem({ key: LocalStorageKey.tier, value });
    window.location.href = PATH_PARAMS.SUBSCRIBER;
  };
  const columns: GridColDef[] = [
    {
      field: 'tier',
      headerName: 'Tier',
      align: 'center',
      headerAlign: 'center',
      width: 120,
      renderCell: item => (
        <strong
          tabIndex={item.hasFocus ? 0 : -1}
          className="cell_tier"
          onClick={() => handleSubscriber(item)}
          style={{ color: handleColorTier(item.value) }}>
          {item.value}{' '}
          {subscriptions &&
            subscriptions.paypalBillingPlans?.tier?.split('_')[0] === item.value && <Check />}
        </strong>
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
      <DialogContent style={{ border: '1px solid #ebebec' }}>
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

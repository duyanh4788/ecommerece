import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
} from '@mui/material';
import { PAYPAL_BANNER } from 'commom/common.contants';
import { useDispatch, useSelector } from 'react-redux';
import * as SubscriptionSile from 'store/subscription/shared/slice';
import { Cancel, CheckCircle } from '@mui/icons-material';
import * as SubscriptionSelector from 'store/subscription/shared/selectors';
import { Loading } from 'commom/loading';
interface Props {
  modalCancel: boolean;
  shopId: string;
  handleClose: (e: boolean) => void;
  subscriptionId: string | null;
}

export const ModalCancel = ({ modalCancel, handleClose, subscriptionId, shopId }: Props) => {
  const dispatch = useDispatch();
  const loadingSubs = useSelector(SubscriptionSelector.selectLoading);
  const [reason, setReson] = useState<string>('');

  const handleOnclose = () => {
    handleClose(false);
    setReson('');
  };

  return (
    <Dialog open={modalCancel} onClose={handleOnclose} maxWidth={'sm'}>
      {loadingSubs ? <Loading /> : null}
      <Box display={'flex'} justifyContent={'space-between'}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Paypal Ecommerce AnhVu</DialogTitle>
        <img src={PAYPAL_BANNER} alt={PAYPAL_BANNER} />
      </Box>
      <DialogContent style={{ border: '1px solid #ebebec' }}>
        It looks like you’ve recently cancelled your Ecommerce Subscription. Our friendly support
        team is happy to help with any issues you may have encountered. Don’t hesitate to get in
        touch with us <a href="mailto:duyanh4788@gmail.com">here</a>
        <TextField
          autoFocus
          margin="dense"
          id="reason"
          type="text"
          fullWidth
          variant="outlined"
          placeholder="please typing reason"
          style={{ border: '1px solid #ebebec' }}
          value={reason}
          onChange={e => setReson(e.target.value)}
        />
      </DialogContent>
      <Divider />
      <DialogActions>
        <IconButton onClick={handleOnclose}>
          <Cancel color="error" />
        </IconButton>
        <IconButton
          disabled={!reason}
          onClick={() =>
            dispatch(SubscriptionSile.actions.shopCanceled({ subscriptionId, shopId, reason }))
          }>
          <CheckCircle color={!reason ? 'disabled' : 'success'} />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

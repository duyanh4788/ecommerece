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
import { useDispatch } from 'react-redux';
import * as SubscriptionSile from 'store/subscription/shared/slice';
import { Cancel, CheckCircle } from '@mui/icons-material';

interface Props {
  modalCancel: boolean;
  handleClose: (e: boolean) => void;
  subscriptionId: string | null;
}

export const ModalCancel = ({ modalCancel, handleClose, subscriptionId }: Props) => {
  const dispatch = useDispatch();
  const [reason, setReson] = useState<string | null>(null);

  const handleOnclose = () => {
    handleClose(false);
    setReson(null);
  };

  return (
    <Dialog open={modalCancel} onClose={handleOnclose} maxWidth={'sm'}>
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
            dispatch(SubscriptionSile.actions.userCanceled({ subscriptionId, reason }))
          }>
          <CheckCircle color={!reason ? 'disabled' : 'success'} />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

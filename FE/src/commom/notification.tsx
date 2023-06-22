/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import { Alert, Slide, SlideProps } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

interface Props {
  status: string | any;
  message: string | any;
  path?: string | any;
  onClose: () => void;
}

export const Notification = (notifi: Props) => {
  const navigate = useNavigate();
  const { status, message, path, onClose } = notifi;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
    const timer = setTimeout(() => {
      setOpen(false);
      onClose();
      if (path && status !== 'error') {
        navigate(path);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [notifi]);

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      onClose={() => onClose()}
      TransitionComponent={SlideTransition}
      autoHideDuration={3000}>
      <Alert severity={status.toLowerCase()}>{message}</Alert>
    </Snackbar>
  );
};

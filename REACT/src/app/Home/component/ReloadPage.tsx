import React from 'react';
import { Box, CircularProgress, IconButton, Modal, Typography } from '@mui/material';
import { RestartAlt } from '@mui/icons-material';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWith: 400,
  bgcolor: 'background.paper',
  border: '1px solid #cdcdcd5c',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px',
};

interface Props {
  open: boolean;
  handleClose: (e: boolean) => void;
}

export const RealoadPage = ({ open, handleClose }: Props) => {
  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ backdropFilter: 'blur(10px)' }}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="body1">
          Token Expired, please click refresh authenticate
        </Typography>
        <Typography textAlign={'center'} mt={2}>
          <IconButton
            onClick={() => {
              window.location.reload();
              handleClose(false);
            }}>
            <CircularProgress
              size={10}
              color="warning"
              sx={{
                position: 'absolute',
                top: 16,
                right: 15,
                height: '0 px !important',
                zIndex: 1,
              }}
            />
            <RestartAlt />
          </IconButton>
        </Typography>
      </Box>
    </Modal>
  );
};

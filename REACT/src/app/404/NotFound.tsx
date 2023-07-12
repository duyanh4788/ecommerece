import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CL_GR, PATH_PARAMS } from 'commom/common.contants';

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h1" style={{ color: CL_GR }}>
          404
        </Typography>
        <Box onClick={() => navigate(PATH_PARAMS.HOME)}>
          <Chip label="Home" sx={{ cursor: 'pointer' }} />
        </Box>
      </Box>
    </Box>
  );
};

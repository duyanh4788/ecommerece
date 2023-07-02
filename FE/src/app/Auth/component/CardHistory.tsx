/* eslint-disable react-hooks/exhaustive-deps */
import React, { RefObject, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import { BG_MAIN } from 'commom/common.contants';

interface Props {
  resetDataRef: RefObject<boolean | null>;
}

export const CardHistory = ({ resetDataRef }: Props) => {
  useEffect(() => {
    if (resetDataRef.current) {
      const newResetData = false;
      Object.assign(resetDataRef, { current: newResetData });
    }
  }, [resetDataRef.current]);

  return (
    <Grid item xs={12} sm={6} md={8}>
      <Box display={'flex'} height={'100%'} bgcolor={BG_MAIN} padding={'10px'} borderRadius={'5px'}>
        history
      </Box>
    </Grid>
  );
};

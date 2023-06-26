/* eslint-disable react-hooks/exhaustive-deps */
import React, { RefObject, useEffect } from 'react';
import { Box, Grid } from '@mui/material';

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
      <Box
        display={'flex'}
        height={'100%'}
        bgcolor={'#d6cfc9'}
        padding={'10px'}
        borderRadius={'5px'}>
        History Order
      </Box>
    </Grid>
  );
};

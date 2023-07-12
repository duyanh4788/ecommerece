import React from 'react';
import { CircularProgress } from '@mui/material';

export const LoaderFallBack = () => ({
  fallback: <Loading />,
});

export const Loading = () => {
  return (
    <div className="loading">
      <CircularProgress />
    </div>
  );
};

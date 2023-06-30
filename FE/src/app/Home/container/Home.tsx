import React from 'react';
import { Button, ButtonGroup } from '@mui/material';

export const Home = () => {
  return (
    <div>
      <ButtonGroup variant="contained" aria-label="outlined primary button group">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
    </div>
  );
};

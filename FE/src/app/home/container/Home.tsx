import React from 'react';
import { useSelector } from 'react-redux';
import { Button, ButtonGroup } from '@mui/material';
import * as AuthSelector from 'store/auth/shared/selectors';

export const Home = () => {
  const userInfor = useSelector(AuthSelector.selectUserInfor);
  console.log(userInfor);
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

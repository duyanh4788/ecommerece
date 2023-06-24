import React from 'react';
import { Users } from 'interface/Users.model';
import { Popover } from '@mui/material';
import { UserInforResponsive } from './UserInforResponsive';

interface Props {
  id: string | undefined;
  open: boolean;
  anchorEl: HTMLButtonElement | null;
  setAnchorEl: (value: any) => void;
  userInfor: Users | null;
}

export const PopoverList = (data: Props) => {
  const { id, open, anchorEl, setAnchorEl, userInfor } = data;

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}>
      <UserInforResponsive userInfor={userInfor} />
    </Popover>
  );
};

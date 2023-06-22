import React from 'react';
import { Users } from 'interface/Users.model';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  ThemeProvider,
  createTheme,
  Link,
  List,
} from '@mui/material';
import { ExitToApp, Mail, PersonOutline, PhoneIphone, Today } from '@mui/icons-material';
import * as AuthSlice from 'store/auth/shared/slice';
import { AppHelper } from 'utils/app.helper';
import { useDispatch } from 'react-redux';
import { LocalStorageService } from 'services/localStorage';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { pathParams } from 'commom/common.contants';

interface Props {
  userInfor: Users | null;
}

const FireNav = styled(List)<{ component?: React.ElementType }>({
  '& .MuiListItemButton-root': {
    paddingLeft: 24,
    paddingRight: 24,
  },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 16,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
  '& .MuiListItemButton-root:hover': {
    backgroundColor: '#fff ',
  },
});

export const UserInforResponsive = (props: Props) => {
  const { userInfor } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const local = new LocalStorageService();
  const handleLogout = (primary: string) => {
    if (primary !== 'Log out') return;
    dispatch(AuthSlice.actions.signOut());
    dispatch(AuthSlice.actions.clearUserInfo());
    local.clearLocalStorage();
    navigate(pathParams.SIGNIN);
    return;
  };
  const renderListItemButton = (icon: any, primary: any) => (
    <ListItemButton sx={{ py: 0, minHeight: 40 }} onClick={() => handleLogout(primary)}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText
        primary={primary}
        primaryTypographyProps={{ fontSize: 14, color: '#212321', fontWeight: 'bold' }}
      />
    </ListItemButton>
  );
  return (
    <Box
      sx={{
        bgcolor: '#f9f8f7',
        p: 2,
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #cdcdcd5c',
        borderRadius: '10px',
      }}>
      <ThemeProvider
        theme={createTheme({
          components: {
            MuiListItemButton: {
              defaultProps: {
                disableTouchRipple: true,
              },
            },
          },
          palette: {
            mode: 'dark',
            primary: { main: 'rgb(102, 157, 246)' },
            background: { paper: 'rgb(5, 30, 52)' },
          },
        })}>
        <FireNav component="nav" disablePadding>
          {AppHelper.isEmpty(userInfor) ? (
            <React.Fragment>
              {renderListItemButton(<PersonOutline color="primary" />, userInfor?.fullName)}
              {renderListItemButton(<Mail color="info" />, userInfor?.email)}
              {renderListItemButton(<PhoneIphone color="secondary" />, userInfor?.phone || 'none')}
              {renderListItemButton(
                <Today color="success" />,
                AppHelper.formmatDateTimeChat(userInfor?.createdAt),
              )}
              {renderListItemButton(<ExitToApp color="warning" />, 'Log out')}
            </React.Fragment>
          ) : (
            <Link href={pathParams.SIGNIN}>Please login!</Link>
          )}
        </FireNav>
      </ThemeProvider>
    </Box>
  );
};

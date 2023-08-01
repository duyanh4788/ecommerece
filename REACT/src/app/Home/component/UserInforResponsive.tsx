import React from 'react';
import { Users } from 'interface/Users.model';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  ThemeProvider,
  createTheme,
  List,
  ListItem,
  CircularProgress,
} from '@mui/material';
import { ExitToApp, Mail, PersonOutline, PhoneIphone, Settings, Today } from '@mui/icons-material';
import * as AuthSlice from 'store/auth/shared/slice';
import * as AuthSelector from 'store/auth/shared/selectors';
import { AppHelper } from 'utils/app.helper';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { NavLink, useNavigate } from 'react-router-dom';
import { BG_MAIN_2, BG_MAIN_1, CL_GR, PATH_PARAMS } from 'commom/common.contants';

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
    backgroundColor: BG_MAIN_2,
  },
});

export const UserInforResponsive = (props: Props) => {
  const { userInfor } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(AuthSelector.selectError);
  const handleLogout = (primary: string) => {
    if (primary !== 'Log out') return;
    dispatch(AuthSlice.actions.signOut());
    return;
  };
  const renderListItemButton = (icon: any, primary: any) => (
    <ListItemButton sx={{ py: 0, minHeight: 40 }} onClick={() => handleLogout(primary)}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText
        primary={primary}
        primaryTypographyProps={{ fontSize: 14, color: CL_GR, fontWeight: 'bold' }}
      />
    </ListItemButton>
  );

  return (
    <Box
      sx={{
        bgcolor: BG_MAIN_1,
        padding: '5px',
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
              <ListItem
                component="div"
                disablePadding
                onClick={() => navigate(PATH_PARAMS.PROFILE)}>
                <ListItemButton style={{ justifyContent: 'center' }}>
                  <CircularProgress
                    size={25}
                    color="info"
                    sx={{
                      position: 'absolute',
                      top: 5,
                      height: '0 px !important',
                      zIndex: 1,
                    }}
                  />
                  <Settings color="info" />
                </ListItemButton>
              </ListItem>
              {renderListItemButton(<PersonOutline color="primary" />, userInfor?.fullName)}
              {renderListItemButton(<Mail color="info" />, userInfor?.email)}
              {renderListItemButton(<PhoneIphone color="secondary" />, userInfor?.phone || 'none')}
              {renderListItemButton(
                <Today color="success" />,
                AppHelper.formmatDateTime(userInfor?.createdAt),
              )}
              {renderListItemButton(<ExitToApp color="warning" />, 'Log out')}
            </React.Fragment>
          ) : error && error.code === 402 ? (
            <ListItemText
              primary={
                error.message || 'you are limited request, please try again after some minutes!'
              }
              primaryTypographyProps={{ fontSize: 12, color: '#ff0000', fontWeight: 'bold' }}
            />
          ) : (
            <NavLink style={{ color: 'blue' }} to={PATH_PARAMS.SIGNIN}>
              Please login!
            </NavLink>
          )}
        </FireNav>
      </ThemeProvider>
    </Box>
  );
};

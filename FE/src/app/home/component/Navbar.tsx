/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import {
  AppBar,
  Link,
  Stack,
  Toolbar,
  createTheme,
  CssBaseline,
  Box,
  Drawer,
  Paper,
  Divider,
  InputBase,
  Avatar,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ShoppingCartSharp, MenuOutlined } from '@mui/icons-material';
import { ThemeProvider } from '@emotion/react';
import bannernode from '../../../images/bannernode.png';
import { AppHelper } from 'utils/app.helper';
import { PopoverList } from './Popover';
import { UserInforResponsive } from './UserInforResponsive';
import { Users } from 'interface/Users.model';
import { AuthContext } from 'app/authContext/AuthContextApi';
import { defaultNotifi, pathParams } from 'commom/common.contants';
import { Unsubscribe } from 'redux';
import { RootStore } from 'store/configStore';
import * as AuthSlice from 'store/auth/shared/slice';
import { Notification } from 'commom/notification';
import { LocalStorageService } from 'services/localStorage';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as AuthSelector from 'store/auth/shared/selectors';
import { Loading } from 'commom/loading';

const useStyles = makeStyles(theme => ({
  appBar: {
    padding: '10px 0',
  },
  logo: {
    color: 'black',
    width: 'max-content',
    fontSize: '20px',
  },
  toolbar: {
    margin: '0 auto',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
  },
  icons: {
    color: '#2e7d32',
    cursor: 'pointer',
  },
}));

const darkTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#f8f7f7',
    },
  },
});

export const Navbar = () => {
  const userInfor: Users = useContext(AuthContext);
  const local = new LocalStorageService();
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(AuthSelector.selectLoading);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [notifi, setNotifi] = useState(defaultNotifi);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    const storeSub$: Unsubscribe = RootStore.subscribe(() => {
      const { type, payload } = RootStore.getState().lastAction;
      switch (type) {
        case AuthSlice.actions.signOutSuccess.type:
          setAnchorEl(null);
          setNotifi({ ...defaultNotifi, status: payload.status, message: payload.message });
          break;
        case AuthSlice.actions.signOutFail.type:
          setNotifi({ ...defaultNotifi, status: payload.status, message: payload.message });
          break;
        case AuthSlice.actions.getUserByIdFail.type:
          setNotifi({ ...defaultNotifi, status: payload.status, message: payload.message });
          local.clearLocalStorage();
          navigate(pathParams.SIGNIN);
          break;
        default:
          break;
      }
    });
    return () => {
      storeSub$();
      dispatch(AuthSlice.actions.clearData());
    };
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(prevState => !prevState);
  };

  const drawer = (
    <Box sx={{ textAlign: 'center', padding: '10px' }}>
      <Link href={pathParams.HOME}>
        <img src={bannernode} alt={bannernode} width="80px" height="80px" />
      </Link>
      <Divider style={{ marginBottom: '10px' }} />
      <UserInforResponsive userInfor={userInfor} />
    </Box>
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const container = typeof window !== 'undefined' ? () => window.document.body : undefined;
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <Stack sx={{ flexGrow: 1, marginBottom: '100px' }}>
      {loading && <Loading />}
      {notifi.status && <Notification {...notifi} onClose={() => setNotifi(defaultNotifi)} />}
      <CssBaseline />
      <ThemeProvider theme={darkTheme}>
        <AppBar className={classes.appBar} component="nav">
          <Toolbar disableGutters className={classes.toolbar}>
            <MenuOutlined
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { xs: 'block', md: 'none' }, cursor: 'pointer' }}
            />
            <Link href={pathParams.HOME} sx={{ display: { xs: 'none', md: 'block' } }}>
              <img src={bannernode} alt={bannernode} width="80px" height="80px" />
            </Link>
            <Paper
              component="form"
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '10px',
                border: '1px solid #cdcdcd5c',
                width: '100%',
                maxWidth: 400,
              }}>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search"
                inputProps={{ 'aria-label': 'search' }}
              />
              <SearchIcon />
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <ShoppingCartSharp className={classes.icons} fontSize="medium" />
            </Paper>
            <Box sx={{ display: { xs: 'none', md: 'block' }, cursor: 'pointer' }}>
              <span onClick={handleClick}>
                <Avatar sx={{ bgcolor: '#56ab2f' }} src={userInfor?.avatar}>
                  {AppHelper.convertFullName(userInfor?.fullName)}
                </Avatar>
              </span>
            </Box>
            <PopoverList
              id={id}
              open={open}
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
              userInfor={userInfor}
            />
          </Toolbar>
        </AppBar>
        <Box component="nav">
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 300, background: '#f8f7f7' },
            }}>
            {drawer}
          </Drawer>
        </Box>
      </ThemeProvider>
    </Stack>
  );
};

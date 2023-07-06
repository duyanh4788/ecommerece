/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import {
  AppBar,
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
import { AppHelper } from 'utils/app.helper';
import { PopoverList } from './Popover';
import { UserInforResponsive } from './UserInforResponsive';
import { Users } from 'interface/Users.model';
import { AuthContext } from 'app/AuthContext/AuthContextApi';
import { BG_MAIN_1, CL_GR, CL_GRE, NODEJS1, PATH_PARAMS } from 'commom/common.contants';
import { Unsubscribe } from 'redux';
import { RootStore } from 'store/configStore';
import * as AuthSlice from 'store/auth/shared/slice';
import * as AuthSelector from 'store/auth/shared/selectors';
import { LocalStorageKey, TypeLocal } from 'services/localStorage';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Loading } from 'commom/loading';
import { toast } from 'react-toastify';
import { Notification } from 'commom/notification';
import { localStorage } from 'hooks/localStorage/LocalStorage';

const useStyles = makeStyles(theme => ({
  appBar: {
    padding: '10px 0',
  },
  logo: {
    color: CL_GR,
    width: 'max-content',
    fontSize: '20px',
  },
  toolbar: {
    margin: '0 auto',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 20px',
  },
  icons: {
    color: CL_GRE,
    cursor: 'pointer',
  },
}));

const darkTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: BG_MAIN_1,
    },
  },
});

export const Navbar = () => {
  const userInfor: Users = useContext(AuthContext);
  const userStore = localStorage(TypeLocal.GET, LocalStorageKey.user);
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(AuthSelector.selectLoading);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    const storeSub$: Unsubscribe = RootStore.subscribe(() => {
      const { type, payload } = RootStore.getState().lastAction;
      if (payload && payload.code === 401) {
        resetAuthentica(payload.message, payload.code);
        return;
      }
      switch (type) {
        case AuthSlice.actions.signOutSuccess.type:
          resetAuthentica(payload.message, payload.code);
          break;
        case AuthSlice.actions.signOutFail.type:
        case AuthSlice.actions.getUserByIdFail.type:
        case AuthSlice.actions.refreshTokenFail.type:
          toast.error(payload.message);
          break;
        default:
          break;
      }
    });
    return () => {
      storeSub$();
      resetData();
    };
  }, []);

  const resetData = () => {
    setAnchorEl(null);
    dispatch(AuthSlice.actions.clearData());
    return;
  };

  const resetAuthentica = (message: string, code: number) => {
    if (code >= 400) {
      toast.error(message);
    }
    if (code < 300 && code >= 200) {
      toast.success(message);
    }
    localStorage(TypeLocal.CLEAR);
    resetData();
    dispatch(AuthSlice.actions.clearUserInfo());
    navigate(PATH_PARAMS.SIGNIN);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(prevState => !prevState);
  };

  const drawer = (
    <Box sx={{ textAlign: 'center', padding: '10px' }}>
      <img
        src={NODEJS1}
        alt={NODEJS1}
        width="80px"
        height="80px"
        onClick={() => navigate(PATH_PARAMS.HOME)}
      />
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
      <Notification />
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
            <Box
              sx={{ display: { xs: 'none', md: 'block' }, cursor: 'pointer' }}
              onClick={() => navigate(PATH_PARAMS.HOME)}>
              <img src={NODEJS1} alt={NODEJS1} width="80px" height="80px" />
            </Box>
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
                <Avatar sx={{ bgcolor: CL_GRE }} src={userInfor?.avatar}>
                  {AppHelper.convertFullName(userInfor?.fullName || userStore?.fullName)}
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
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260 },
            }}>
            {drawer}
          </Drawer>
        </Box>
      </ThemeProvider>
    </Stack>
  );
};

import React from 'react';

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import FaceIcon from '@mui/icons-material/Face';
import { AppBar, Chip, Link, Toolbar, Typography, useScrollTrigger } from '@mui/material';
import { makeStyles } from '@mui/styles';

function ElevationScroll(props) {
  const { children } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

const useStyles = makeStyles(theme => ({
  appBar: {
    padding: '20px 0',
    background: 'none !important',
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
}));

export const Home = () => {
  const classes = useStyles();

  return (
    <div className="home">
      <ElevationScroll>
        <AppBar className={classes.appBar}>
          <Toolbar disableGutters className={classes.toolbar}>
            <Link href="/">
              <Typography className={classes.logo}>Ecommerce</Typography>
            </Link>
            <Paper
              component="form"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 500 }}>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search"
                inputProps={{ 'aria-label': 'search' }}
              />
              <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            </Paper>
            <div>
              <Chip icon={<FaceIcon />} label="SignIn" />
              <Chip icon={<FaceIcon />} label="SignUp" />
            </div>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
    </div>
  );
};

import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { Done, AddCircle, Cancel } from '@mui/icons-material';
import baner_shop from '../../../images/banner_shop.png';
import { FileUpload, FileUploadProps } from './FileUpload';
import * as AuthSlice from 'store/auth/shared/slice';
import { useDispatch } from 'react-redux';
import { AppHelper } from 'utils/app.helper';
import { CardListItem } from './CardListItem';

const useStyles = makeStyles(theme => ({
  card: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: '0.5',
    '&:hover': {
      opacity: 1,
    },
  },
}));

export const CardShops = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [register, setRegister] = useState<boolean>(false);

  const fileUploadProp: FileUploadProps = {
    accept: 'image/*',
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const { files }: any = event.target;
      if (files !== null && files.length > 0) {
        const formData = new FormData();
        formData.append('file', files.length === 1 ? files[0] : files);
        dispatch(AuthSlice.actions.uploadFile(formData));
      }
    },
    onDrop: (event: React.DragEvent<HTMLElement>) => {
      const { files }: any = event.dataTransfer;
      if (files !== null && files.length > 0) {
        const formData = new FormData();
        formData.append('file', files.length === 1 ? files[0] : files);
        dispatch(AuthSlice.actions.uploadFile(formData));
      }
    },
  };

  const renderRegisted = () => {
    return (
      <Card className="card_profile">
        <CardHeader
          avatar={<Avatar aria-label="recipe">New Shop</Avatar>}
          action={
            <React.Fragment>
              <IconButton aria-label="settings">
                <Done />
              </IconButton>
              <IconButton aria-label="settings" onClick={() => setRegister(!register)}>
                <Cancel />
              </IconButton>
            </React.Fragment>
          }
          title={
            <Typography variant="inherit" fontWeight={'bold'}>
              Registed Shop
            </Typography>
          }
          subheader={AppHelper.formmatDateTime(new Date())}
        />
        <CardMedia component="img" height="194" src={baner_shop} />
        <FileUpload {...fileUploadProp} />
        <CardContent sx={{ fontWeight: 'bold' }}>
          <Typography variant="inherit">Status: waiting admin approved</Typography>
          <CardListItem title={'Name Shop'} value={'nameShop'} name={'nameShop'} />
          <CardListItem title={'Product Sell'} value={'productSell'} name={'productSell'} />
        </CardContent>
      </Card>
    );
  };
  return (
    <Grid item xs={12} sm={8} md={8}>
      <Box display={'flex'} height={'100%'}>
        {register && renderRegisted()}
        <Card className={classes.card} onClick={() => setRegister(!register)}>
          <AddCircle color="success" sx={{ cursor: 'pointer' }} />
        </Card>
      </Box>
    </Grid>
  );
};

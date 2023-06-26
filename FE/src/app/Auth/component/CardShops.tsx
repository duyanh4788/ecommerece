/* eslint-disable react-hooks/exhaustive-deps */
import React, { ChangeEvent, RefObject, useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { Done, AddCircle, Cancel, Edit, Delete } from '@mui/icons-material';
import baner_shop from '../../../images/banner_shop.png';
import { FileUpload, FileUploadProps } from './FileUpload';
import * as ShopSlice from 'store/shops/shared/slice';
import * as ShopSelector from 'store/shops/shared/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { AppHelper } from 'utils/app.helper';
import { CardListItem } from './CardListItem';
import { Products, Shops } from 'interface/Shops.model';

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

interface Props {
  resetDataRef: RefObject<boolean | null>;
}

export const CardShops = ({ resetDataRef }: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [editShop, setEditShop] = useState<boolean>(false);
  const [register, setRegister] = useState<boolean>(false);
  const [shopInfor, setShopInfor] = React.useState<Shops | null>(null);
  const [prodcutSell, setProductSell] = React.useState<Products[]>([]);
  const shops = useSelector(ShopSelector.selectShops);
  const products = useSelector(ShopSelector.selectProducts);
  const url = useSelector(ShopSelector.selectUrl);

  useEffect(() => {
    if (resetDataRef.current) {
      handleResetData();
      const newResetData = false;
      Object.assign(resetDataRef, { current: newResetData });
    }
  }, [resetDataRef.current]);

  useEffect(() => {
    dispatch(ShopSlice.actions.getListsShop());
    dispatch(ShopSlice.actions.prodGetLists());
  }, []);

  const handleDone = () => {
    if (!shopInfor) return;
    const { nameShop, banners } = shopInfor;
    const payload = {
      nameShop,
      prodcutSell: prodcutSell.map(item => item.id),
      banners: url.length ? url : banners,
    };
    if (editShop && shopInfor) {
      dispatch(ShopSlice.actions.updatedShop({ ...payload, id: shopInfor.id }));
    }
    if (register && shopInfor) {
      dispatch(ShopSlice.actions.registedShop({ ...payload }));
    }
  };

  const handleChange = (
    event: SelectChangeEvent<typeof prodcutSell> | ChangeEvent<HTMLInputElement>,
  ) => {
    const {
      target: { name, value },
    }: any = event;
    if (name === 'nameShop') {
      setShopInfor({ ...shopInfor, nameShop: value });
      return;
    }
    setProductSell(value);
  };

  const fileUploadProp: FileUploadProps = {
    accept: 'image/*',
    idInput: 'input-shop',
    onChange: (newFormData: FormData | null) => {
      dispatch(ShopSlice.actions.uploadFile(newFormData));
    },
    onDrop: (event: React.DragEvent<HTMLElement>) => {
      const { files }: any = event.dataTransfer;
      if (files !== null && files.length > 0) {
        const formData = new FormData();
        formData.append('file', files.length === 1 ? files[0] : files);
        dispatch(ShopSlice.actions.uploadFile(formData));
      }
    },
  };

  const renderShops = () => {
    if (!shops.length) return null;
    return shops.map(item => {
      return (
        <Grid item xs={12} sm={6} md={4} key={item?.id}>
          <Card className="card_profile">
            <CardHeader
              avatar={
                <Avatar
                  aria-label="recipe"
                  src={
                    url.length && !register && shopInfor?.id === item.id
                      ? url[0]
                      : item?.banners?.length
                      ? item?.banners[0]
                      : baner_shop
                  }>
                  {item?.nameShop}
                </Avatar>
              }
              action={
                editShop && shopInfor?.id === item.id ? (
                  <React.Fragment>
                    <IconButton aria-label="settings" onClick={handleDone}>
                      <Done />
                    </IconButton>
                    <IconButton aria-label="settings" onClick={() => handleResetData()}>
                      <Cancel />
                    </IconButton>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <IconButton
                      aria-label="settings"
                      onClick={() => {
                        setEditShop(!editShop);
                        setRegister(false);
                        setShopInfor(item);
                        setProductSell(item?.prodcutSell as Products[]);
                      }}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      aria-label="settings"
                      onClick={() => dispatch(ShopSlice.actions.deletedShop(item?.id))}>
                      <Delete />
                    </IconButton>
                  </React.Fragment>
                )
              }
              title={
                <Typography variant="inherit" fontWeight={'bold'}>
                  {item?.nameShop}
                </Typography>
              }
              subheader={AppHelper.formmatDateTime(item?.createdAt)}
            />
            <CardMedia
              component="img"
              height="194"
              src={
                url.length && !register && shopInfor?.id === item.id
                  ? url[0]
                  : item?.banners?.length
                  ? item?.banners[0]
                  : baner_shop
              }
            />
            {editShop && shopInfor?.id === item.id ? <FileUpload {...fileUploadProp} /> : null}
            <CardContent sx={{ fontWeight: 'bold' }}>
              <Box>
                Status:{' '}
                {item?.status ? (
                  <Chip label="approved" size="small" color="success" />
                ) : (
                  <Chip label="waiting admin approved" size="small" color="warning" />
                )}
              </Box>
              {editShop && shopInfor?.id === item.id ? (
                <React.Fragment>
                  <CardListItem
                    title={'Name Shop'}
                    value={shopInfor?.nameShop}
                    handleOnChange={handleChange}
                    name={'nameShop'}
                  />
                  <CardListItem
                    title={'Products'}
                    value={null}
                    name={'prodcutSell'}
                    handleOnChange={handleChange}
                    selectData={{ prodcutSell, products }}
                  />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Box>Name: {item?.nameShop}</Box>
                  <Box>
                    <Typography variant="inherit">Products:</Typography>
                    {item?.prodcutSell?.map(item => (
                      <Chip
                        label={item.nameProduct}
                        key={item.id}
                        sx={{ marginLeft: '2px' }}
                        size="small"
                      />
                    ))}
                  </Box>
                </React.Fragment>
              )}
            </CardContent>
          </Card>
        </Grid>
      );
    });
  };

  const renderRegisted = () => {
    return (
      <Grid item xs={12} sm={6} md={4}>
        <Card className="card_profile">
          <CardHeader
            avatar={
              <Avatar aria-label="recipe" src={url.length ? url[0] : baner_shop}>
                New Shop
              </Avatar>
            }
            action={
              <React.Fragment>
                <IconButton aria-label="settings" onClick={handleDone}>
                  <Done />
                </IconButton>
                <IconButton aria-label="settings" onClick={() => handleCancel()}>
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
          <CardMedia component="img" height="194" src={url.length ? url[0] : baner_shop} />
          {register ? <FileUpload {...fileUploadProp} /> : null}
          <CardContent sx={{ fontWeight: 'bold' }}>
            <Typography variant="inherit">
              Status: <Chip label="waiting admin approved" size="small" color="warning" />
            </Typography>
            <CardListItem
              title={'Name Shop'}
              value={shopInfor?.nameShop}
              handleOnChange={handleChange}
              name={'nameShop'}
            />
            <CardListItem
              title={'Products'}
              value={null}
              name={'prodcutSell'}
              handleOnChange={handleChange}
              selectData={{ prodcutSell, products }}
            />
          </CardContent>
        </Card>
      </Grid>
    );
  };

  const handleResetData = () => {
    setEditShop(false);
    setRegister(false);
    resetValue();
  };

  const handleCancel = () => {
    setRegister(!register);
    setEditShop(false);
    resetValue();
  };

  const resetValue = () => {
    setProductSell([]);
    setShopInfor(null);
    dispatch(ShopSlice.actions.clearUrl());
  };

  return (
    <Grid item xs={12} sm={12} md={12}>
      <Box height={'100%'} bgcolor={'#d6cfc9'} padding={'10px'} borderRadius={'5px'}>
        <Grid container columns={{ xs: 6, sm: 12, md: 12 }} columnSpacing={3}>
          {renderShops()}
          {register && renderRegisted()}
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card} sx={{ display: 'flex', flexDirection: 'column' }}>
              <IconButton disabled={shops.length >= 2} onClick={() => handleCancel()}>
                <CircularProgress
                  size={24}
                  color="success"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 1,
                  }}
                />
                <AddCircle color="success" sx={{ cursor: 'pointer' }} />
              </IconButton>
              <Typography variant="inherit" fontWeight={'bold'}>
                you have registed free {!shops.length ? 2 + 'more' : 2 - shops.length} Shop
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

/* eslint-disable react-hooks/exhaustive-deps */
import React, { ChangeEvent, RefObject, useEffect, useState } from 'react';
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
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Done,
  AddCircle,
  Cancel,
  Delete,
  DashboardCustomize,
  CheckCircle,
  Unpublished,
} from '@mui/icons-material';
import { FileUpload, FileUploadProps } from '../../../hooks/component/FileUpload';
import * as ShopSlice from 'store/shops/shared/slice';
import * as ShopSelector from 'store/shops/shared/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { AppHelper } from 'utils/app.helper';
import { CardListItem } from '../../../hooks/component/CardListItem';
import { Shops } from 'interface/Shops.model';
import {
  BANNER_SHOP,
  MSG_DRAG_IMG,
  PATH_PARAMS,
  TITLE_REGISTED_SHOP,
  TITLE_STATUS_SHOP,
  TITLE_WAITING,
} from 'commom/common.contants';
import { useNavigate } from 'react-router-dom';
import { LocalStorageKey, TypeLocal } from 'services/localStorage';
import { localStorage } from 'hooks/localStorage/LocalStorage';
import { SubscriptionStatus } from 'interface/Subscriptions.model';
import { toast } from 'react-toastify';

interface Props {
  resetDataRef: RefObject<boolean | null>;
}

export const CardListShops = ({ resetDataRef }: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, setRegister] = useState<boolean>(false);
  const [shopInfor, setShopInfor] = React.useState<Shops | null>(null);
  const shops = useSelector(ShopSelector.selectShops);
  const url = useSelector(ShopSelector.selectUrl);

  useEffect(() => {
    if (resetDataRef.current) {
      handleResetData();
      const newResetData = false;
      Object.assign(resetDataRef, { current: newResetData });
    }
  }, [resetDataRef.current]);

  const handleDone = () => {
    if (!shopInfor) return;
    const { nameShop, banners } = shopInfor;
    const payload = {
      nameShop,
      banners: url.length ? url : banners,
    };
    if (register && shopInfor) {
      dispatch(ShopSlice.actions.registedShop({ ...payload }));
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    }: any = event;
    if (name === 'nameShop') {
      setShopInfor({ ...shopInfor, nameShop: value });
      return;
    }
  };

  const handleResetData = () => {
    setRegister(false);
    setShopInfor(null);
    resetValue();
  };

  const handleCancel = () => {
    setRegister(!register);
    resetValue();
    if (url.length) {
      dispatch(ShopSlice.actions.removeFile({ idImage: url[0] }));
      dispatch(ShopSlice.actions.clearUrl());
    }
  };

  const resetValue = () => {
    setShopInfor(null);
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
        if (files.length > 1) {
          toast.error(MSG_DRAG_IMG);
          return;
        }
        const formData = new FormData();
        formData.append('file', files.length === 1 ? files[0] : files);
        dispatch(ShopSlice.actions.uploadFile(formData));
      }
    },
  };

  const renderShops = () => {
    if (!shops.length)
      return (
        <Box className="box_empty">
          <Typography component="span">
            <Typography variant="caption" component="p">
              You have no Shop.
            </Typography>
            <Typography variant="caption" component="p">
              You can click register and experience our product selling feature.
            </Typography>
          </Typography>
        </Box>
      );
    return shops.map(item => {
      return (
        <Card className="card_profile" key={item?.id} sx={{ marginBottom: '5px' }}>
          <CardHeader
            avatar={
              <Avatar
                aria-label="recipe"
                src={
                  url.length && !register && shopInfor?.id === item.id
                    ? url[0]
                    : item?.banners?.length
                    ? item?.banners[0]
                    : BANNER_SHOP
                }>
                {item?.nameShop}
              </Avatar>
            }
            action={
              <React.Fragment>
                <IconButton
                  onClick={() => {
                    localStorage(TypeLocal.SET, LocalStorageKey.shopId, item.id);
                    navigate(PATH_PARAMS.MANAGER_SHOP);
                  }}>
                  <DashboardCustomize color="success" />
                </IconButton>
                <IconButton onClick={() => dispatch(ShopSlice.actions.deletedShop(item?.id))}>
                  <Delete color="error" />
                </IconButton>
              </React.Fragment>
            }
            title={
              <React.Fragment>
                <Typography variant="inherit" fontWeight={'bold'}>
                  {item?.nameShop}
                  {item?.status ? (
                    <CheckCircle color="success" />
                  ) : (
                    <Tooltip
                      title={
                        item?.subscription?.status === SubscriptionStatus.WAITING_SYNC
                          ? TITLE_WAITING
                          : TITLE_STATUS_SHOP
                      }>
                      <Unpublished color="warning" />
                    </Tooltip>
                  )}
                </Typography>
                <Typography variant="inherit" component={'span'} fontWeight={'bold'}>
                  Products:
                  {item?.prodcutSell?.map(item => (
                    <Chip
                      label={item.nameProduct}
                      key={item.id}
                      sx={{ marginLeft: '2px' }}
                      size="small"
                      avatar={<Avatar src={item.avatar} alt={item.avatar} />}
                    />
                  ))}
                </Typography>
              </React.Fragment>
            }
            subheader={AppHelper.formmatDateTime(item?.createdAt)}
          />
        </Card>
      );
    });
  };

  return (
    <React.Fragment>
      <Grid item xs={12} sm={6} md={7} maxHeight={'460px'} sx={{ overflowX: 'auto' }}>
        {renderShops()}
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        {!register ? (
          <Card className="card_registed">
            <IconButton onClick={() => handleCancel()}>
              <CircularProgress
                size={24}
                color="success"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 1,
                  height: '0 px !important',
                }}
              />
              <AddCircle color="success" sx={{ cursor: 'pointer' }} />
            </IconButton>
            <Typography variant="inherit" fontWeight={'bold'}>
              Registed Shop
            </Typography>
          </Card>
        ) : (
          <Card className="card_profile">
            <CardHeader
              avatar={
                <Avatar aria-label="recipe" src={url.length ? url[0] : BANNER_SHOP}>
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
            <CardMedia component="img" height="194" src={url.length ? url[0] : BANNER_SHOP} />
            {register ? <FileUpload {...fileUploadProp} /> : null}
            <CardContent sx={{ fontWeight: 'bold' }}>
              <Box>
                Status: <Chip label={TITLE_REGISTED_SHOP} size="small" color="warning" />
              </Box>
              <CardListItem
                title={'Name Shop'}
                value={shopInfor?.nameShop}
                handleOnChange={handleChange}
                name={'nameShop'}
              />
            </CardContent>
          </Card>
        )}
      </Grid>
    </React.Fragment>
  );
};

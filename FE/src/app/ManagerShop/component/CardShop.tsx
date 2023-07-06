/* eslint-disable react-hooks/exhaustive-deps */
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Grid,
  IconButton,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { Done, Cancel, Edit, Delete, DashboardCustomize } from '@mui/icons-material';
import * as ShopSlice from 'store/shops/shared/slice';
import * as ShopSelector from 'store/shops/shared/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { AppHelper } from 'utils/app.helper';
import { Products, Shops } from 'interface/Shops.model';
import { BANNER_SHOP, PATH_PARAMS } from 'commom/common.contants';
import { useNavigate } from 'react-router-dom';
import { LocalStorageKey, TypeLocal } from 'services/localStorage';
import { localStorage } from 'hooks/localStorage/LocalStorage';
import { FileUpload, FileUploadProps } from '../../../hooks/component/FileUpload';
import { CardListItem } from '../../../hooks/component/CardListItem';
import { Unsubscribe } from 'redux';
import { RootStore } from 'store/configStore';
import { toast } from 'react-toastify';

interface Props {
  shopInfor: Shops | null;
  PAGE: string | null;
  handleEvent: (e: any) => void;
}

export const CardShop = ({ shopInfor, PAGE, handleEvent }: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentPage: string = 'SHOP';
  const shopId = localStorage(TypeLocal.GET, LocalStorageKey.shopId);
  const products = useSelector(ShopSelector.selectProducts);
  const [editShop, setEditShop] = useState<boolean>(false);
  const [shop, setShop] = React.useState<Shops | null>(shopInfor);
  const [prodcutSell, setProductSell] = React.useState<Products[]>([]);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    const storeSub$: Unsubscribe = RootStore.subscribe(() => {
      if (PAGE !== currentPage) return;
      const { type, payload } = RootStore.getState().lastAction;
      switch (type) {
        case ShopSlice.actions.updatedShopSuccess.type:
          dispatch(ShopSlice.actions.getShopById(shopId));
          urlRef.current = null;
          handleResetData();
          break;
        case ShopSlice.actions.deletedShopSuccess.type:
          toast.success(payload.message);
          localStorage(TypeLocal.REMOVE, LocalStorageKey.shopId);
          navigate(PATH_PARAMS.PROFILE);
          break;
        case ShopSlice.actions.uploadFileSuccess.type:
          toast.success(payload.message);
          if (urlRef.current === null) {
            urlRef.current = payload.data[0];
          }
          break;
        case ShopSlice.actions.updatedShopFail.type:
        case ShopSlice.actions.uploadFileFail.type:
        case ShopSlice.actions.deletedShopFail.type:
          toast.error(payload.message);
          handleResetData();
          break;
        default:
          break;
      }
    });
    return () => {
      storeSub$();
    };
  }, [PAGE]);

  const handleDone = () => {
    if (!shop) return;
    const { nameShop, banners } = shop;
    const payload = {
      nameShop,
      prodcutSell: prodcutSell && prodcutSell.length ? prodcutSell.map(item => item.id) : [],
      banners: urlRef?.current ? [urlRef.current] : banners,
    };
    if (urlRef?.current && banners && banners.length) {
      dispatch(ShopSlice.actions.removeFile({ idImage: banners[0] }));
    }
    dispatch(ShopSlice.actions.updatedShop({ ...payload, id: shop.id }));
  };

  const handleChange = (
    event: SelectChangeEvent<typeof prodcutSell> | ChangeEvent<HTMLInputElement>,
  ) => {
    const {
      target: { name, value },
    }: any = event;
    if (name === 'nameShop') {
      setShop({ ...shop, nameShop: value });
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

  const handleResetData = () => {
    setEditShop(false);
    setProductSell([]);
    setShop(null);
    if (urlRef?.current) {
      dispatch(ShopSlice.actions.removeFile({ idImage: urlRef.current }));
      dispatch(ShopSlice.actions.clearUrl());
      urlRef.current = null;
    }
  };

  return (
    <Grid item xs={12} sm={6} md={6} onClick={() => handleEvent('SHOP')}>
      <Card className="card_profile">
        <CardHeader
          avatar={
            <Avatar
              aria-label="recipe"
              src={
                urlRef?.current
                  ? urlRef?.current
                  : shopInfor?.banners?.length
                  ? shopInfor?.banners[0]
                  : BANNER_SHOP
              }>
              {shopInfor?.nameShop}
            </Avatar>
          }
          action={
            editShop ? (
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
                    setShop(shopInfor);
                    setProductSell(shopInfor?.prodcutSell as Products[]);
                  }}>
                  <Edit />
                </IconButton>
                <IconButton
                  aria-label="settings"
                  onClick={() => dispatch(ShopSlice.actions.deletedShop(shopInfor?.id))}>
                  <Delete />
                </IconButton>
              </React.Fragment>
            )
          }
          title={
            <Typography variant="inherit" fontWeight={'bold'}>
              {shopInfor?.nameShop}
              <IconButton
                onClick={() => {
                  localStorage(TypeLocal.SET, LocalStorageKey.shopId, shopInfor?.id);
                  navigate(PATH_PARAMS.MANAGER_SHOP);
                }}>
                <DashboardCustomize color="success" />
              </IconButton>
            </Typography>
          }
          subheader={AppHelper.formmatDateTime(shopInfor?.createdAt)}
        />
        <CardMedia
          component="img"
          height="194"
          src={
            urlRef?.current
              ? urlRef?.current
              : shopInfor?.banners?.length
              ? shopInfor?.banners[0]
              : BANNER_SHOP
          }
        />
        {editShop ? <FileUpload {...fileUploadProp} /> : null}
        <CardContent sx={{ fontWeight: 'bold', fontSize: '14px', lineHeight: '30px' }}>
          <Box>
            Status:{' '}
            {shopInfor?.status ? (
              <Chip label="Active" size="small" color="success" />
            ) : (
              <Chip label="Disabled" size="small" color="warning" />
            )}
          </Box>
          {editShop ? (
            <React.Fragment>
              <CardListItem
                title={'Name Shop'}
                value={shop?.nameShop}
                handleOnChange={handleChange}
                name={'nameShop'}
              />
              <CardListItem
                title={'Products'}
                value={null}
                name={'prodcutSell'}
                handleOnChange={handleChange}
                selectData={{ prodcutSell: prodcutSell || [], products }}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Box>Name: {shopInfor?.nameShop}</Box>
              <Box>
                Products:{' '}
                {shopInfor?.prodcutSell?.map((item, idx) => (
                  <Chip
                    label={item.nameProduct}
                    key={idx}
                    sx={{ marginLeft: '2px' }}
                    size="small"
                    avatar={<Avatar src={item.avatar} alt={item.avatar} />}
                  />
                ))}
              </Box>
            </React.Fragment>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

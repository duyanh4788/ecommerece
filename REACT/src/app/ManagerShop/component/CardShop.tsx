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
  Grid,
  IconButton,
  SelectChangeEvent,
  Tooltip,
  Typography,
} from '@mui/material';
import { Done, Cancel, Edit, Delete, DashboardCustomize } from '@mui/icons-material';
import * as ShopSlice from 'store/shops/shared/slice';
import * as ShopSelector from 'store/shops/shared/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { AppHelper } from 'utils/app.helper';
import { Products, Shops } from 'interface/Shops.model';
import { BANNER_SHOP, MSG_DRAG_IMG, PATH_PARAMS, TITLE_STATUS_SHOP } from 'commom/common.contants';
import { useNavigate } from 'react-router-dom';
import { LocalStorageKey, TypeLocal } from 'services/localStorage';
import { localStorage } from 'hooks/localStorage/LocalStorage';
import { FileUpload, FileUploadProps } from '../../../hooks/component/FileUpload';
import { CardListItem } from '../../../hooks/component/CardListItem';
import { toast } from 'react-toastify';

interface Props {
  shopInfor: Shops | null;
  resetDataRefShop: RefObject<boolean | null>;
  urlRefShop: RefObject<string | null>;
}

export const CardShop = ({ shopInfor, resetDataRefShop, urlRefShop }: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector(ShopSelector.selectProducts);
  const [editShop, setEditShop] = useState<boolean>(false);
  const [shop, setShop] = React.useState<Shops | null>(shopInfor);
  const [productIds, setProducts] = React.useState<Products[]>([]);

  useEffect(() => {
    if (resetDataRefShop.current) {
      handleResetData();
      const newResetData = false;
      Object.assign(resetDataRefShop, { current: newResetData });
    }
  }, [resetDataRefShop.current]);

  const handleResetData = () => {
    setEditShop(false);
    setProducts([]);
    setShop(null);
  };

  const handleDone = () => {
    if (!shop) return;
    const { nameShop, banners } = shop;
    if (!nameShop || nameShop === '') {
      setEditShop(false);
      return;
    }
    if (
      shopInfor?.nameShop === nameShop &&
      !urlRefShop?.current?.length &&
      AppHelper.compareArrayProducts(shopInfor?.products as any[], productIds)
    ) {
      setEditShop(false);
      return;
    }
    const resultProduct = productIds && productIds.length ? handleResultProduct(productIds) : [];
    const payload = {
      nameShop,
      productIds: resultProduct,
      banners: urlRefShop?.current ? [urlRefShop.current] : banners,
    };
    if (urlRefShop?.current && banners && banners.length) {
      dispatch(ShopSlice.actions.removeFile({ idImage: banners[0] }));
    }
    dispatch(ShopSlice.actions.updatedShop({ ...payload, id: shop.id }));
    return;
  };

  const handleResultProduct = (resultProduct: Products[]) => {
    const result: Products[] = [];
    products.forEach(item => {
      const prod = resultProduct.find(res => res.id === item.id);
      if (!prod) {
        result.push({ id: item.id, status: false });
      } else {
        result.push({ id: item.id, status: true });
      }
    });
    return result;
  };

  const handleChange = (
    event: SelectChangeEvent<typeof productIds> | ChangeEvent<HTMLInputElement>,
  ) => {
    const {
      target: { name, value },
    }: any = event;
    if (name === 'nameShop') {
      setShop({ ...shop, nameShop: value });
      return;
    }
    setProducts(value);
  };

  const handleCancel = () => {
    handleResetData();
    if (urlRefShop?.current) {
      dispatch(ShopSlice.actions.removeFile({ idImage: urlRefShop.current }));
    }
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

  return (
    <Grid item xs={12} sm={6} md={6}>
      <Card className="card_profile">
        <CardHeader
          avatar={
            <Avatar
              aria-label="recipe"
              src={
                urlRefShop?.current
                  ? urlRefShop?.current
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
                <IconButton aria-label="settings" onClick={() => handleCancel()}>
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
                    setProducts(shopInfor?.products as Products[]);
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
            urlRefShop?.current
              ? urlRefShop?.current
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
              <Tooltip title={TITLE_STATUS_SHOP}>
                <Chip label="Disabled" size="small" color="warning" />
              </Tooltip>
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
                name={'productIds'}
                handleOnChange={handleChange}
                selectData={{ productIds: productIds || [], products }}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Box>Name: {shopInfor?.nameShop}</Box>
              <Box>
                Products:{' '}
                {shopInfor?.products?.map((item, idx) => (
                  <Chip
                    label={item.nameProduct}
                    key={idx}
                    sx={{ marginLeft: '2px' }}
                    size="small"
                    avatar={<Avatar src={item.avatar} alt={item.avatar} />}
                  />
                ))}
                {!shopInfor?.products?.length && (
                  <Chip label="Please add product you can selling!" color="warning" />
                )}
              </Box>
            </React.Fragment>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

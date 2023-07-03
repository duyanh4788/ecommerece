/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as ShopSlice from 'store/shops/shared/slice';
import * as ShopSelector from 'store/shops/shared/selectors';
import { toast } from 'react-toastify';
import { Unsubscribe } from 'redux';
import { RootStore } from 'store/configStore';
import {
  Box,
  Card,
  Divider,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { BG_MAIN_1, BG_MAIN_2, PATH_PARAMS } from 'commom/common.contants';
import { Loading } from 'commom/loading';
import { localStorage } from 'hooks/localStorage/LocalStorage';
import { LocalStorageKey, TypeLocal } from 'services/localStorage';
import { SwipersList } from '../component/SwipersList';
import { DeleteForever, DisabledByDefault, Edit, Undo } from '@mui/icons-material';
import { FileUpload, FileUploadProps } from '../component/FileUpload';

export const ManagerShop = () => {
  const dispatch = useDispatch();
  const shopId = localStorage(TypeLocal.GET, LocalStorageKey.shopId);
  const navigate = useNavigate();
  const loading = useSelector(ShopSelector.selectLoading);
  const shopInfor = useSelector(ShopSelector.selectShopInfor);
  const [editSlides, setEditSlides] = useState<boolean>(false);
  const [alignment, setAlignment] = React.useState<string | null>('ALL');
  const slidesUpdateRef = useRef<string[]>([]);

  useEffect(() => {
    function initShop(id) {
      if (!id) {
        navigate(PATH_PARAMS.PROFILE);
        return;
      }
      dispatch(ShopSlice.actions.getShopById(id));
    }
    initShop(shopId);
  }, [shopId]);

  useEffect(() => {
    const storeSub$: Unsubscribe = RootStore.subscribe(() => {
      const { type, payload } = RootStore.getState().lastAction;
      switch (type) {
        case ShopSlice.actions.updatedShopSuccess.type:
        case ShopSlice.actions.updatedSlidersSuccess.type:
          dispatch(ShopSlice.actions.getShopById(shopId));
          slidesUpdateRef.current = [];
          break;
        case ShopSlice.actions.uploadFileSuccess.type:
          toast.success(payload.message);
          if (payload && payload.data.length) {
            const result = {
              id: shopId,
              sliders: payload.data,
            };
            dispatch(ShopSlice.actions.updatedShop(result));
          }
          break;
        case ShopSlice.actions.removeFileSuccess.type:
          const result = {
            id: shopId,
            sliders: slidesUpdateRef.current,
          };
          dispatch(ShopSlice.actions.updatedSliders(result));
          break;
        case ShopSlice.actions.registedShopFail.type:
        case ShopSlice.actions.updatedShopFail.type:
        case ShopSlice.actions.updatedSlidersFail.type:
        case ShopSlice.actions.uploadFileFail.type:
          toast.error(payload.message);
          break;
        default:
          break;
      }
    });
    return () => {
      storeSub$();
      dispatch(ShopSlice.actions.clearData());
      slidesUpdateRef.current = [];
    };
  }, []);

  const fileUploadProp: FileUploadProps = {
    accept: 'image/*',
    idInput: 'input-shop',
    onChange: (newFormData: FormData | null) => {
      console.log(newFormData);
      dispatch(ShopSlice.actions.uploadFile(newFormData));
    },
    onDrop: (event: React.DragEvent<HTMLElement>) => {
      const { files }: any = event.dataTransfer;
      if (files !== null && files.length > 0) {
        const formData = new FormData();
        formData.append('file', files.length === 1 ? files[0] : files);
        console.log(formData);
        // dispatch(ShopSlice.actions.uploadFile(formData));
      }
    },
  };

  const renderImagesList = (sliders: string[]): React.ReactElement | React.ReactElement[] => {
    if (!sliders || !sliders.length) return <FileUpload {...fileUploadProp} />;
    return (
      <React.Fragment>
        <IconButton onClick={() => setEditSlides(false)}>
          <DisabledByDefault />
        </IconButton>
        <Divider sx={{ margin: '5px 0' }} />
        <ImageList cols={3} sx={{ padding: '20px' }}>
          {sliders?.map((item, idx) => (
            <ImageListItem key={idx}>
              <img
                src={`${item}?w=164&h=164&fit=crop&auto=format`}
                srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                alt={item}
                loading="lazy"
                style={{ borderRadius: '20px', border: '1px solid #cdcdcd5c' }}
              />
              <ImageListItemBar
                sx={{ background: 'none' }}
                position="top"
                actionIcon={
                  <IconButton
                    onClick={() => {
                      dispatch(ShopSlice.actions.removeFile({ idImage: item }));
                      slidesUpdateRef.current = sliders.filter(f => f !== item);
                    }}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 1,
                      height: '0 px !important',
                    }}>
                    <DeleteForever color="error" />
                  </IconButton>
                }
                actionPosition="left"
              />
            </ImageListItem>
          ))}
        </ImageList>
        <Divider sx={{ margin: '5px 0' }} />
        {sliders.length < 5 && <FileUpload {...fileUploadProp} />}
      </React.Fragment>
    );
  };

  return (
    <Paper sx={{ background: BG_MAIN_1, margin: '20px', padding: '10px', borderRadius: '5px' }}>
      <IconButton onClick={() => navigate(-1)}>
        <Undo />
      </IconButton>
      {loading && <Loading />}
      <Box component={'div'} className="outstanding">
        {shopInfor?.nameShop}
      </Box>
      <Divider sx={{ margin: '5px 0' }} />
      {shopInfor?.sliders && shopInfor.sliders.length && !editSlides ? (
        <Box component={'div'}>
          <SwipersList data={shopInfor.sliders} />
          <IconButton onClick={() => setEditSlides(true)}>
            <Edit />
          </IconButton>
        </Box>
      ) : (
        <Card sx={{ background: BG_MAIN_2 }}>
          {renderImagesList(shopInfor?.sliders as string[])}
        </Card>
      )}
      <Divider sx={{ margin: '5px 0' }} />
      <ToggleButtonGroup
        color="success"
        value={alignment}
        exclusive
        onChange={(e, newAlignment) => setAlignment(newAlignment)}
        aria-label="Platform">
        <ToggleButton
          value={'ALL'}
          sx={{
            borderRadius: '50% !important',
            marginRight: '5px',
            marginLeft: '0 !important',
          }}>
          All
        </ToggleButton>
        {shopInfor?.prodcutSell?.map(item => (
          <ToggleButton
            value={item.id}
            sx={{
              borderRadius: '20px !important',
              marginRight: '5px',
              marginLeft: '0 !important',
              border: '1px solid rgba(0, 0, 0, 0.12) !important',
            }}>
            {item.nameProduct}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Paper>
  );
};

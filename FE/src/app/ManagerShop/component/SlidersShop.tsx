/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as ShopSlice from 'store/shops/shared/slice';
import { DeleteForever, DisabledByDefault, Edit } from '@mui/icons-material';
import {
  Box,
  Card,
  Divider,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material';
import { BG_MAIN_2, PAGE_MN_SHOP } from 'commom/common.contants';
import { SwipersList } from 'hooks/component/SwipersList';
import { FileUpload, FileUploadProps } from 'hooks/component/FileUpload';
import { toast } from 'react-toastify';
import { Unsubscribe } from 'redux';
import { RootStore } from 'store/configStore';
import { Shops } from 'interface/Shops.model';
import { localStorage } from 'hooks/localStorage/LocalStorage';
import { LocalStorageKey, TypeLocal } from 'services/localStorage';

interface Props {
  shopInfor: Shops | null;
  PAGE: string | null;
  handleEvent: (e: any) => void;
}

export const SlidersShop = ({ shopInfor, PAGE, handleEvent }: Props) => {
  const dispatch = useDispatch();
  const currentPage: string = PAGE_MN_SHOP.SLIDER;
  const shopId = localStorage(TypeLocal.GET, LocalStorageKey.shopId);
  const [editSlides, setEditSlides] = useState<boolean>(false);
  const slidesUpdateRef = useRef<string[]>([]);

  useEffect(() => {
    const storeSub$: Unsubscribe = RootStore.subscribe(() => {
      if (PAGE !== currentPage) return;
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
            slidesUpdateRef.current = payload.data;
            dispatch(ShopSlice.actions.updatedShop(result));
          }
          break;
        case ShopSlice.actions.removeFileSuccess.type:
          if (slidesUpdateRef.current?.length) {
            const result = {
              id: shopId,
              sliders: slidesUpdateRef.current,
            };
            dispatch(ShopSlice.actions.updatedSliders(result));
          }
          break;
        case ShopSlice.actions.updatedShopFail.type:
        case ShopSlice.actions.updatedSlidersFail.type:
        case ShopSlice.actions.uploadFileFail.type:
          toast.error(payload.message);
          if (slidesUpdateRef.current && slidesUpdateRef.current.length) {
            dispatch(ShopSlice.actions.removeFile({ idImage: slidesUpdateRef.current }));
            slidesUpdateRef.current = [];
          }
          break;
        default:
          break;
      }
    });
    return () => {
      storeSub$();
      slidesUpdateRef.current = [];
    };
  }, [PAGE]);

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

  return shopInfor?.sliders && shopInfor.sliders.length && !editSlides ? (
    <Box component={'div'} my={2} onClick={() => handleEvent(PAGE_MN_SHOP.SLIDER)}>
      <SwipersList data={shopInfor.sliders} />
      <IconButton onClick={() => setEditSlides(true)}>
        <Edit />
      </IconButton>
    </Box>
  ) : (
    <Card
      sx={{ background: BG_MAIN_2, margin: '10px 0' }}
      onClick={() => handleEvent(PAGE_MN_SHOP.SLIDER)}>
      {renderImagesList(shopInfor?.sliders as string[])}
    </Card>
  );
};

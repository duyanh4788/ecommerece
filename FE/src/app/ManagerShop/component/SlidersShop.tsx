/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
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
import { BG_MAIN_2 } from 'commom/common.contants';
import { SwipersList } from 'hooks/component/SwipersList';
import { FileUpload, FileUploadProps } from 'hooks/component/FileUpload';
import { Shops } from 'interface/Shops.model';

interface Props {
  shopInfor: Shops | null;
  handleStatusUploadSliders: (value: boolean) => void;
}

export const SlidersShop = ({ shopInfor, handleStatusUploadSliders }: Props) => {
  const dispatch = useDispatch();
  const [editSlides, setEditSlides] = useState<boolean>(false);

  const fileUploadProp: FileUploadProps = {
    accept: 'image/*',
    idInput: 'input-shop',
    onChange: (newFormData: FormData | null) => {
      dispatch(ShopSlice.actions.uploadFile(newFormData));
      handleStatusUploadSliders(true);
    },
    onDrop: (event: React.DragEvent<HTMLElement>) => {
      const { files }: any = event.dataTransfer;
      if (files !== null && files.length > 0) {
        const formData = new FormData();
        formData.append('file', files.length === 1 ? files[0] : files);
        dispatch(ShopSlice.actions.uploadFile(formData));
        handleStatusUploadSliders(true);
      }
    },
  };

  const handleUploadSlider = (idImage: string) => {
    const listSlider = shopInfor?.sliders?.filter(item => item !== idImage);
    const result = {
      id: shopInfor?.id,
      sliders: listSlider,
      idImageRemove: idImage,
    };
    dispatch(ShopSlice.actions.updatedSliders(result));
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
                    onClick={() => handleUploadSlider(item)}
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
    <Box component={'div'} my={2}>
      <SwipersList data={shopInfor.sliders} />
      <IconButton onClick={() => setEditSlides(true)}>
        <Edit />
      </IconButton>
    </Box>
  ) : (
    <Card sx={{ background: BG_MAIN_2, margin: '10px 0' }}>
      {renderImagesList(shopInfor?.sliders as string[])}
    </Card>
  );
};

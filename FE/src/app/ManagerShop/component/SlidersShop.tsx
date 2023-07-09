/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as ShopSlice from 'store/shops/shared/slice';
import { Edit } from '@mui/icons-material';
import { Box, Card, IconButton } from '@mui/material';
import { BG_MAIN_2, renderMsgUploadItems } from 'commom/common.contants';
import { SwipersList } from 'hooks/component/SwipersList';
import { FileUploadProps } from 'hooks/component/FileUpload';
import { Shops } from 'interface/Shops.model';
import { toast } from 'react-toastify';
import { RenderImagesList } from 'hooks/component/RenderImagesList';

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
        if (
          shopInfor &&
          shopInfor.sliders &&
          shopInfor.sliders.length &&
          shopInfor.sliders.length + files.length > 5
        ) {
          toast.error(renderMsgUploadItems(5 - shopInfor.sliders.length));
          return;
        }
        const newFormData = new FormData();
        for (let i = 0; i < files.length; i++) {
          newFormData.append('file', files[i]);
        }
        dispatch(ShopSlice.actions.uploadFile(newFormData));
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

  return shopInfor?.sliders && shopInfor.sliders.length && !editSlides ? (
    <Box component={'div'} my={2}>
      <SwipersList data={shopInfor.sliders} />
      <IconButton onClick={() => setEditSlides(true)}>
        <Edit />
      </IconButton>
    </Box>
  ) : (
    <Card sx={{ background: BG_MAIN_2, margin: '10px 0' }}>
      <RenderImagesList
        sliders={shopInfor?.sliders as string[]}
        setEditSlides={setEditSlides}
        handleUploadSlider={handleUploadSlider}
        fileUploadProp={fileUploadProp}
      />
    </Card>
  );
};

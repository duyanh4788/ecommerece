import { Cancel, DeleteForever, DisabledByDefault } from '@mui/icons-material';
import { Divider, IconButton, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import React from 'react';
import { FileUpload, FileUploadProps } from './FileUpload';

interface Props {
  sliders: string[];
  setEditSlides: (e: boolean) => void;
  handleUploadSlider: (item: any) => void;
  fileUploadProp: FileUploadProps;
}

export const RenderImagesList = ({
  sliders,
  setEditSlides,
  handleUploadSlider,
  fileUploadProp,
}: Props) => {
  if (!sliders || !sliders.length) return <FileUpload {...fileUploadProp} />;
  return (
    <React.Fragment>
      <IconButton onClick={() => setEditSlides(false)} className="cancel_btn">
        <Cancel />
      </IconButton>
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
      {sliders.length < 5 && <FileUpload {...fileUploadProp} />}
    </React.Fragment>
  );
};

import React from 'react';
import { Box, Typography } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';

const useStyles = makeStyles({
  root: {
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    color: '#56ab2f',
    padding: '5px',
    '&:hover p,&:hover svg,& img': {
      opacity: 1,
    },
    '& p, svg': {
      opacity: 0.4,
    },
    '&:hover img': {
      opacity: 0.3,
    },
  },
  iconText: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
  },
  hidden: {
    display: 'none',
  },
  onDragOver: {
    '& img': {
      opacity: 0.3,
    },
    '& p, svg': {
      opacity: 1,
    },
  },
});

export type FileUploadProps = {
  accept?: string;
  hoverLabel?: string;
  dropLabel?: string;
  width?: string;
  height?: string;
  backgroundColor?: string;
  image?: {
    url: string;
    imageStyle?: {
      width?: string;
      height?: string;
    };
  };
  idInput?: string;
  onDrop: (event: React.DragEvent<HTMLElement>) => void;
  onChange: (newFormData: FormData | null) => void;
};

export const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  hoverLabel = 'Click or drag to upload file',
  dropLabel = 'Drop file here',
  width = '200px',
  height = '60px',
  backgroundColor = 'none',
  idInput,
  onDrop,
  onChange,
}) => {
  const classes = useStyles();
  const [labelText, setLabelText] = React.useState<string>(hoverLabel);
  const [isDragOver, setIsDragOver] = React.useState<boolean>(false);
  const stopDefaults = (e: React.DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };
  const dragEvents = {
    onDragEnter: (e: React.DragEvent) => {
      stopDefaults(e);
      setIsDragOver(true);
      setLabelText(dropLabel);
    },
    onDragLeave: (e: React.DragEvent) => {
      stopDefaults(e);
      setIsDragOver(false);
      setLabelText(hoverLabel);
    },
    onDragOver: stopDefaults,
    onDrop: (e: React.DragEvent<HTMLElement>) => {
      stopDefaults(e);
      setLabelText(hoverLabel);
      setIsDragOver(false);
      onDrop(e);
    },
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files }: any = event.target;
    if (files !== null && files.length > 0) {
      const newFormData = new FormData();
      newFormData.append('file', files.length === 1 ? files[0] : files);
      onChange(newFormData);
    }
  };

  return (
    <React.Fragment>
      <input
        onChange={handleChange}
        accept={accept}
        className={classes.hidden}
        id={idInput}
        type="file"
      />
      <label
        htmlFor={idInput}
        {...dragEvents}
        className={clsx(classes.root, isDragOver && classes.onDragOver)}>
        <Box width={width} height={height} bgcolor={backgroundColor}>
          <Box height={height} width={width} className={classes.iconText}>
            <CloudUpload fontSize="large" />
            <Typography>{labelText}</Typography>
          </Box>
        </Box>
      </label>
    </React.Fragment>
  );
};

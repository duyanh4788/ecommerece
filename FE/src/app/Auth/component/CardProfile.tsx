import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { Done, Edit } from '@mui/icons-material';
import { AppHelper } from 'utils/app.helper';
import { useDispatch, useSelector } from 'react-redux';
import * as AuthSlice from 'store/auth/shared/slice';
import * as AuthSelector from 'store/auth/shared/selectors';
import profile from '../../../images/profile.png';
import { FileUpload, FileUploadProps } from './FileUpload';
import { CardListItem } from './CardListItem';

interface Props {
  resetData: () => void;
}

export const CardProfile = (props: Props) => {
  const { resetData } = props;
  const dispatch = useDispatch();
  const userInfor = useSelector(AuthSelector.selectUserInfor);
  const url = useSelector(AuthSelector.selectUrl);
  const [user, setUser] = useState(userInfor);
  const [errors, setErrors] = useState(userInfor);
  const [editProfile, setEditProfile] = useState<boolean>(false);

  const validate = () => {
    if (
      !user?.email ||
      !user.phone ||
      !user.fullName ||
      !(Math.ceil(Math.log10(Number(user?.phone) + 1)) >= 10)
    ) {
      return false;
    }
    return true;
  };

  const renderAvatar = () => {
    if (!url.length && !userInfor?.avatar) {
      return profile;
    }
    if (!url.length && userInfor?.avatar) {
      return userInfor?.avatar;
    }
    if (url.length) {
      return url[0];
    }
  };
  const handleChange = event => {
    const { name, value } = event.target;
    if (name === 'phone' && value.length > 10) {
      return;
    }
    setUser({ ...user, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handlerUpdateProfile = () => {
    dispatch(AuthSlice.actions.updateProfile(user));
    handleResetData();
  };

  const fileUploadProp: FileUploadProps = {
    accept: 'image/*',
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const { files }: any = event.target;
      if (files !== null && files.length > 0) {
        const formData = new FormData();
        formData.append('file', files.length === 1 ? files[0] : files);
        dispatch(AuthSlice.actions.uploadFile(formData));
      }
    },
    onDrop: (event: React.DragEvent<HTMLElement>) => {
      const { files }: any = event.dataTransfer;
      if (files !== null && files.length > 0) {
        const formData = new FormData();
        formData.append('file', files.length === 1 ? files[0] : files);
        dispatch(AuthSlice.actions.uploadFile(formData));
      }
    },
  };

  const handleResetData = () => {
    setEditProfile(false);
    setUser(userInfor);
    setErrors(userInfor);
    resetData();
  };

  return (
    <Grid item xs={12} sm={4} md={4}>
      <Card className="card_profile">
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" src={userInfor?.avatar}>
              {AppHelper.convertFullName(userInfor?.fullName)}
            </Avatar>
          }
          action={
            <React.Fragment>
              {editProfile && (
                <IconButton
                  aria-label="settings"
                  disabled={!validate()}
                  style={{ cursor: !validate() ? 'no-drop' : 'pointer' }}
                  onClick={handlerUpdateProfile}>
                  <Done />
                </IconButton>
              )}
              <IconButton
                aria-label="settings"
                onClick={() => {
                  if (!editProfile) {
                    handleResetData();
                  }
                  setEditProfile(!editProfile);
                }}>
                <Edit />
              </IconButton>
            </React.Fragment>
          }
          title={
            editProfile ? (
              <input type="text" name="fullName" value={user?.fullName} onChange={handleChange} />
            ) : (
              <Typography sx={{ fontWeight: 'bold' }} variant="inherit">
                {userInfor?.fullName}
              </Typography>
            )
          }
          subheader={AppHelper.formmatDateTime(userInfor?.createdAt)}
        />
        <CardMedia component="img" height="194" image={renderAvatar()} alt={renderAvatar()} />
        <FileUpload {...fileUploadProp} />
        <CardContent sx={{ fontWeight: 'bold' }}>
          <Typography variant="inherit">Email: {userInfor?.email}</Typography>
          {editProfile ? (
            <CardListItem
              title={'Phone'}
              name={'phone'}
              value={user?.phone}
              handleOnChange={handleChange}
            />
          ) : (
            <Box>Phone: {userInfor?.phone}</Box>
          )}
          {editProfile ? (
            <CardListItem
              title={'Password'}
              name={'password'}
              value={user?.password}
              handleOnChange={handleChange}
            />
          ) : (
            <Box>Password: {userInfor?.password}</Box>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

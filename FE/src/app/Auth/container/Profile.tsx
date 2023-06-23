/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Grid,
  IconButton,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { useInjectReducer, useInjectSaga } from 'store/core/@reduxjs/redux-injectors';
import { AuthSaga } from 'store/auth/shared/saga';
import * as AuthSlice from 'store/auth/shared/slice';
import * as AuthSelector from 'store/auth/shared/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { Unsubscribe } from 'redux';
import { RootStore } from 'store/configStore';
import { toast } from 'react-toastify';
import { Done, Edit } from '@mui/icons-material';
import { AppHelper } from 'utils/app.helper';
import profile from '../../../images/profile.png';
import { FileUpload, FileUploadProps } from '../component/FileUpload';
import { Loading } from 'commom/loading';

export const Profile = () => {
  const dispatch = useDispatch();
  const userInfor = useSelector(AuthSelector.selectUserInfor);
  const loading = useSelector(AuthSelector.selectLoading);
  const url = useSelector(AuthSelector.selectUrl);
  const [user, setUser] = useState(userInfor);
  const [errors, setErrors] = useState(userInfor);
  const [editProfile, setEditProfile] = useState<boolean>(false);

  useInjectReducer({
    key: AuthSlice.sliceKey,
    reducer: AuthSlice.reducer,
  });
  useInjectSaga({
    key: AuthSlice.sliceKey,
    saga: AuthSaga,
  });

  useEffect(() => {
    const storeSub$: Unsubscribe = RootStore.subscribe(() => {
      const { type, payload } = RootStore.getState().lastAction;
      switch (type) {
        case AuthSlice.actions.updateProfileSuccess.type:
          dispatch(AuthSlice.actions.getUserById());
          toast.success(payload.message);
          setEditProfile(false);
          resetData();
          break;
        case AuthSlice.actions.uploadFileSuccess.type:
          toast.success(payload.message);
          if (payload && payload.data.length) {
            const data = { avatar: payload.data[0] };
            dispatch(AuthSlice.actions.updateProfile(data));
          }
          break;
        case AuthSlice.actions.updateProfileFail.type:
        case AuthSlice.actions.uploadFileFail.type:
          toast.error(payload.message);
          break;
        default:
          break;
      }
    });
    return () => {
      storeSub$();
      dispatch(AuthSlice.actions.clearData());
      resetData();
    };
  }, []);

  const resetData = () => {
    setUser(userInfor);
    setErrors(userInfor);
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    if (!user?.email || !user.phone || !user.fullName) {
      return false;
    }
    return true;
  };

  const handlerUpdateProfile = () => {
    dispatch(AuthSlice.actions.updateProfile(user));
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

  return (
    <Container sx={{ padding: '24px 0' }}>
      {loading && <Loading />}
      <Grid container spacing={2} columns={{ md: 12 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
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
                      setEditProfile(!editProfile);
                      resetData();
                    }}>
                    <Edit />
                  </IconButton>
                </React.Fragment>
              }
              title={
                editProfile ? (
                  <OutlinedInput
                    className="input_profile"
                    name="fullName"
                    value={user?.fullName}
                    onChange={handleChange}
                  />
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
              <Box>
                Phone:{' '}
                {editProfile ? (
                  <OutlinedInput
                    className="input_profile"
                    name="phone"
                    type="number"
                    value={user?.phone}
                    onChange={handleChange}
                  />
                ) : (
                  userInfor?.phone
                )}
              </Box>
              <Box>
                Password:{' '}
                {editProfile && (
                  <OutlinedInput
                    className="input_profile"
                    name="password"
                    value={user?.password}
                    onChange={handleChange}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={8}>
          <Card>
            <CardMedia
              component="img"
              alt="green iguana"
              height="140"
              image="/static/images/cards/contemplative-reptile.jpg"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Lizard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lizards are a widespread group of squamate reptiles, with over 6,000 species,
                ranging across all continents except Antarctica
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Share</Button>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

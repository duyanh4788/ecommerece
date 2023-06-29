/* eslint-disable react-hooks/exhaustive-deps */
import React, { ChangeEvent, RefObject, useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { Done, Edit, HelpOutline } from '@mui/icons-material';
import { AppHelper } from 'utils/app.helper';
import { useDispatch, useSelector } from 'react-redux';
import * as AuthSlice from 'store/auth/shared/slice';
import * as AuthSelector from 'store/auth/shared/selectors';
import * as SubscriptionSlice from 'store/subscription/shared/slice';
import * as SubscriptionSelector from 'store/subscription/shared/selectors';
import profile from 'images/profile.png';
import { FileUpload, FileUploadProps } from './FileUpload';
import { CardListItem } from './CardListItem';
import { SubscriptionStatus, TypeSubscriber } from 'interface/Subscriptions.model';
import { FREE_TRIAL, PAYPAL_LOGO, TITLE_RESOURCE } from 'commom/common.contants';
import { handleColorStatus, handleColorTier } from 'utils/color';
import { ModalPlans } from './ModalPlans';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ModalInvoices } from './ModalInvoices';
import { ModalCancel } from './ModalCancel';

interface Props {
  resetDataRef: RefObject<boolean | null>;
}

export const CardProfile = ({ resetDataRef }: Props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const userInfor = useSelector(AuthSelector.selectUserInfor);
  const url = useSelector(AuthSelector.selectUrl);
  const plans = useSelector(SubscriptionSelector.selectPlans);
  const invoices = useSelector(SubscriptionSelector.selectInvoices);
  const subscriptions = useSelector(SubscriptionSelector.selectSubscription);
  const [user, setUser] = useState(userInfor);
  const [errors, setErrors] = useState(userInfor);
  const [editProfile, setEditProfile] = useState<boolean>(false);
  const [modalPlans, setModalPlans] = useState<boolean>(false);
  const [modalInvoice, setModalInvoice] = useState<boolean>(false);
  const [modalCancel, setModalCancel] = useState<boolean>(false);
  const [typeSubscriber, setTypeSubscriber] = useState<string>(TypeSubscriber.SUBSCRIBER);

  useEffect(() => {
    const { pathname, search } = location;

    if (search.includes('notification')) {
      const decode = decodeURIComponent(search).replaceAll('%20', ' ');
      toast.success(decode.split('=')[1]);
    }
    navigate(pathname, { replace: true });
  }, [location, navigate]);

  useEffect(() => {
    dispatch(SubscriptionSlice.actions.userGetSubscription());
    dispatch(SubscriptionSlice.actions.getPlans());
    dispatch(SubscriptionSlice.actions.userGetInvoices());
  }, []);

  useEffect(() => {
    if (resetDataRef.current) {
      handleResetUserProfile();
      handleResetSubscription();
      const newResetData = false;
      Object.assign(resetDataRef, { current: newResetData });
    }
  }, [resetDataRef.current]);

  const validate = () => {
    if (!user?.email || !user.phone || !user.fullName) {
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
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'phone' && value.length > 10) {
      return;
    }
    setUser({ ...user, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handlerUpdateProfile = () => {
    dispatch(AuthSlice.actions.updateProfile(user));
  };

  const fileUploadProp: FileUploadProps = {
    accept: 'image/*',
    idInput: 'input-profile',
    onChange: (newFormData: FormData | null) => {
      dispatch(AuthSlice.actions.uploadFile(newFormData));
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

  const handleResetUserProfile = () => {
    setEditProfile(false);
    setUser(userInfor);
    setErrors(userInfor);
  };

  const handleResetSubscription = () => {
    setModalPlans(false);
    setModalInvoice(false);
    setModalCancel(false);
    setTypeSubscriber(TypeSubscriber.SUBSCRIBER);
  };

  return (
    <Grid container columns={{ xs: 6, sm: 12, md: 12 }} spacing={2}>
      <Grid item xs={12} sm={6} md={5}>
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
                      handleResetUserProfile();
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
          {!editProfile && <FileUpload {...fileUploadProp} />}
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
            {editProfile && (
              <CardListItem
                title={'Password'}
                name={'password'}
                value={user?.password}
                handleOnChange={handleChange}
              />
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={7}>
        {subscriptions ? (
          <Card className="card_profile" style={{ height: '100%' }}>
            <CardHeader
              title={
                <Typography sx={{ fontWeight: 'bold' }} variant="inherit">
                  Tier:{' '}
                  <span
                    style={{
                      color: handleColorTier(subscriptions.paypalBillingPlans?.tier as string),
                    }}>
                    {AppHelper.capitalizeFirstLetter(
                      subscriptions.paypalBillingPlans?.tier as string,
                    )}
                  </span>
                </Typography>
              }
              action={
                subscriptions.isTrial ? (
                  <Tooltip title="You are on a free trial in 30 days">
                    <img width={'50px'} src={FREE_TRIAL} alt={FREE_TRIAL} />
                  </Tooltip>
                ) : null
              }
              subheader={AppHelper.formmatDateTime(subscriptions.lastPaymentsFetch)}
            />
            <Box sx={{ background: '#f4f4f1', textAlign: 'center', padding: '0 10px' }}>
              <img style={{ maxHeight: '100px' }} src={PAYPAL_LOGO} alt={PAYPAL_LOGO} />
            </Box>
            <CardContent sx={{ lineHeight: '35px', color: '#00000099' }}>
              <Typography variant="inherit">
                Status:{' '}
                <span
                  className="status"
                  style={{ color: handleColorStatus(subscriptions.status as string) }}>
                  {subscriptions.status?.split('_').join(' ')}
                </span>
              </Typography>
              <Typography variant="inherit">
                Resouce Product: {subscriptions.usersResources?.numberProduct} / month{' '}
                <Tooltip title={TITLE_RESOURCE}>
                  <HelpOutline sx={{ fontSize: '12px' }} color="success" />
                </Tooltip>
              </Typography>
              <Typography variant="inherit">
                Resouce Index: {subscriptions.usersResources?.numberIndex} / month{' '}
                <Tooltip title={TITLE_RESOURCE}>
                  <HelpOutline sx={{ fontSize: '12px' }} color="success" />
                </Tooltip>
              </Typography>
              <Chip
                label="Invoices"
                color="success"
                variant="outlined"
                size="small"
                sx={{ cursor: 'pointer' }}
                onClick={() => setModalInvoice(true)}
              />
            </CardContent>
            <CardActions className="subs">
              {subscriptions.status === SubscriptionStatus.ACTIVE ? (
                <Button className="btn_unsub" onClick={() => setModalCancel(true)}>
                  UnSubscribe
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setModalPlans(true);
                    setTypeSubscriber(TypeSubscriber.SUBSCRIBER);
                  }}>
                  Subscribe
                </Button>
              )}
              {subscriptions.status === SubscriptionStatus.ACTIVE ||
              subscriptions.status === SubscriptionStatus.APPROVAL_PENDING ? (
                <Button
                  className="btn_change"
                  onClick={() => {
                    setModalPlans(true);
                    setTypeSubscriber(TypeSubscriber.CHANGED);
                  }}>
                  Changed
                </Button>
              ) : null}
            </CardActions>
          </Card>
        ) : (
          <div className="box_subs">
            <Box>
              <Typography>30 DAYS ACCESS TO ALL FEATURES on your selected subscription.</Typography>
              <Typography>Change and/or cancel your subscription at any time</Typography>
              <Button
                onClick={() => {
                  setModalPlans(true);
                  setTypeSubscriber(TypeSubscriber.SUBSCRIBER);
                }}>
                Subscribe
              </Button>
            </Box>
          </div>
        )}
      </Grid>
      {modalPlans ? (
        <ModalPlans
          plans={plans}
          subscriptions={subscriptions}
          modalPlans={modalPlans}
          handleClose={setModalPlans}
          typeSubscriber={typeSubscriber}
        />
      ) : null}
      {modalInvoice ? (
        <ModalInvoices
          modalInvoice={modalInvoice}
          handleClose={setModalInvoice}
          invoices={invoices}
          userInfor={userInfor}
        />
      ) : null}
      {modalCancel ? (
        <ModalCancel
          modalCancel={modalCancel}
          handleClose={setModalCancel}
          subscriptionId={subscriptions?.subscriptionId as string}
        />
      ) : null}
    </Grid>
  );
};

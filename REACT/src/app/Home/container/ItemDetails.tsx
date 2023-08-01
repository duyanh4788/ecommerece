import {
  Avatar,
  Box,
  Chip,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { PATH_PARAMS } from 'commom/common.contants';
import { SwipersList } from 'hooks/component/SwipersList';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as GuestSlice from 'store/guest/shared/slice';
import * as GuestSelector from 'store/guest/shared/selectors';
import { AppHelper } from 'utils/app.helper';
import { LocalAtm, ShoppingCart } from '@mui/icons-material';

export const ItemDetails = () => {
  const { itemId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const itemInfor = useSelector(GuestSelector.selectItemInfor);
  const [numberCart, setNumberCard] = useState(1);

  useEffect(() => {
    function initItemId(data: string) {
      if (!data) {
        navigate(PATH_PARAMS.HOME);
        return;
      }
      dispatch(GuestSlice.actions.getItemById(itemId));
    }
    initItemId(itemId as string);
  }, []);

  const handleDecrement = () => {
    if (numberCart > 1) {
      setNumberCard(numberCart - 1);
    }
  };

  const handleIncrement = () => {
    if (
      !itemInfor ||
      (itemInfor && Number(itemInfor?.quantityStock) <= 0) ||
      numberCart >= Number(itemInfor?.quantityStock)
    )
      return;
    setNumberCard(numberCart + 1);
  };

  return (
    <Box m={5}>
      <Grid container columns={{ xs: 6, sm: 12, md: 12 }} spacing={3}>
        <Grid item xs={12} sm={6} md={6}>
          <SwipersList data={itemInfor?.itemThumb || []} type={true} />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Box className="box_item">
            <h2>
              {itemInfor?.nameItem}{' '}
              <Chip label={`${itemInfor?.quantitySold} Sold`} style={{ marginLeft: '5px' }} />
            </h2>
            <Chip label={`${itemInfor?.prices} $`} variant="outlined" />
            <List>
              <ListItem>
                <ListItemText primary="Origin" secondary={itemInfor?.origin} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Description" secondary={itemInfor?.description} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Brand Name" secondary={itemInfor?.brandName} />
              </ListItem>
            </List>
            <Box className="box_add">
              <label>
                <span className="add_to_cart" onClick={handleDecrement}>
                  -
                </span>
                <span className="add_to_cart">{numberCart}</span>
                <span className="add_to_cart" onClick={handleIncrement}>
                  +
                </span>
              </label>
              <Chip
                label={`${itemInfor?.quantityStock} / Sotck`}
                variant="outlined"
                color="success"
                style={{ marginLeft: '5px' }}
              />
            </Box>
            <Box className="box_add_btn">
              <Tooltip title="add to cart">
                <IconButton>
                  <ShoppingCart color="warning" />
                </IconButton>
              </Tooltip>
              <Tooltip title="buy now">
                <IconButton>
                  <LocalAtm color="success" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <List className="box_item" style={{ marginTop: '20px' }}>
        {itemInfor?.entityValues &&
          Object.keys(
            itemInfor?.entityValues[AppHelper.handleEntityValue(itemInfor?.entityValues) || ''],
          ).map(item => {
            console.log(item);
            const value =
              itemInfor?.entityValues?.[AppHelper.handleEntityValue(itemInfor?.entityValues) || ''][
                item
              ];
            if (item !== 'id' && item !== 'entityId' && typeof value !== 'boolean') {
              return (
                <ListItem key={item}>
                  <ListItemText
                    primary={AppHelper.toTitleCase(item) || null}
                    secondary={
                      itemInfor?.entityValues?.[
                        AppHelper.handleEntityValue(itemInfor?.entityValues) || ''
                      ][item] || null
                    }
                  />
                </ListItem>
              );
            }
            if (typeof value === 'boolean') {
              return (
                <ListItem key={item}>
                  <ListItemText
                    primary={AppHelper.toTitleCase(item) || null}
                    secondary={
                      itemInfor?.entityValues?.[
                        AppHelper.handleEntityValue(itemInfor?.entityValues) || ''
                      ][item]
                        ? 'Yes'
                        : 'No'
                    }
                  />
                </ListItem>
              );
            }
          })}
      </List>
    </Box>
  );
};

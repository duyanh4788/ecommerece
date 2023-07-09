/* eslint-disable react-hooks/exhaustive-deps */
import React, { RefObject, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Grid,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { Cancel, Edit, Delete, ExpandCircleDown } from '@mui/icons-material';
import * as ItemSlice from 'store/items/shared/slice';
import * as ItemSelector from 'store/items/shared/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { Shops } from 'interface/Shops.model';
import { BANNER_SHOP } from 'commom/common.contants';
import { ItemsInterface, TypeSaga } from 'interface/Items.mode';
import { AppHelper } from 'utils/app.helper';
import { CardAddItem } from './CardAddItem';

interface Props {
  shopInfor: Shops | null;
  resetDataRefItems: RefObject<boolean | null>;
}

const toge1 = {
  borderRadius: '50% !important',
  marginRight: '5px',
  marginLeft: '0 !important',
};

const toge2 = {
  marginRight: '5px',
  marginLeft: '0 !important',
  borderRadius: '20px !important',
  border: '1px solid rgba(0, 0, 0, 0.12) !important',
};

export const CardItem = ({ shopInfor, resetDataRefItems }: Props) => {
  const dispatch = useDispatch();
  const listItems = useSelector(ItemSelector.selectListItems);
  const [items, setItems] = useState<ItemsInterface[]>([]);
  const [addItem, setAddItem] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<boolean>(false);
  const [itemCurr, setItemCurr] = React.useState<ItemsInterface | null>(null);
  const [alignment, setAlignment] = React.useState<string | null>('ALL');
  const [togge, setTogge] = React.useState<string>('ALL');

  useEffect(() => {
    if (resetDataRefItems.current) {
      handleResetData();
      const newResetData = false;
      Object.assign(resetDataRefItems, { current: newResetData });
    }
  }, [resetDataRefItems.current]);

  useEffect(() => {
    function initListItem(data, typeSaga) {
      if (!data || !data.length) return;
      if (!items.length || Object.keys(TypeSaga).includes(typeSaga)) {
        setItems(data);
        return;
      }
      setItems([...items, ...data]);
      return;
    }
    initListItem(listItems?.items, listItems?.typeSaga);
  }, [listItems]);

  const handleResetData = () => {
    setEditItem(false);
    setAddItem(false);
    setItemCurr(null);
  };

  const renderListItems = useMemo(() => {
    if (!items?.length) return null;
    return items.map((item, idx) => {
      return (
        <Grid item xs={6} sm={3} md={2} key={idx}>
          <Card className="card_profile" sx={{ border: item.isAdd ? '1px solid #56ab2f' : 'none' }}>
            <CardHeader
              action={
                editItem && itemCurr && itemCurr.id === item.id ? (
                  <IconButton aria-label="settings" onClick={() => handleResetData()}>
                    <Cancel sx={{ fontSize: '15px' }} />
                  </IconButton>
                ) : (
                  <React.Fragment>
                    <IconButton
                      onClick={() => {
                        setItemCurr(item);
                        setEditItem(!editItem);
                      }}>
                      <Edit sx={{ fontSize: '15px' }} />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setItemCurr(item);
                        dispatch(ItemSlice.actions.deletedItem(item?.id));
                      }}>
                      <Delete sx={{ fontSize: '15px' }} />
                    </IconButton>
                  </React.Fragment>
                )
              }
              title={
                <Tooltip title={item.nameItem}>
                  <Typography variant="caption" display="block" gutterBottom>
                    {AppHelper.textTruncate(item?.nameItem as string)}
                  </Typography>
                </Tooltip>
              }
              subheader={
                <Typography variant="caption" display="block" gutterBottom>
                  Stock: {item?.quantityStock}
                </Typography>
              }
            />
            <CardMedia
              component="img"
              height="30"
              src={item?.itemThumb?.length ? item?.itemThumb[0] : BANNER_SHOP}
            />
            <CardContent>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography variant="caption" display="block" gutterBottom>
                  Sold: {item?.quantitySold}{' '}
                </Typography>
                <Chip label={`${item.prices}/$`} size="small" variant="outlined" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      );
    });
  }, [items, editItem]);

  const handleTogge = (value: string) => {
    if (togge === value || (togge === 'ALL' && value === '')) return;
    setItems([]);
    dispatch(
      ItemSlice.actions.getListsItems({
        id: shopInfor?.id,
        option: value,
      }),
    );
  };

  return (
    <Box my={2}>
      {shopInfor?.prodcutSell && shopInfor?.prodcutSell.length && (
        <ToggleButtonGroup
          color="success"
          value={alignment}
          exclusive
          sx={{ marginBottom: '20px' }}
          onChange={(e: any, newAlignment) => {
            setAlignment(newAlignment);
            setTogge(e.target.innerText);
          }}>
          {shopInfor?.prodcutSell && shopInfor?.prodcutSell.length && (
            <ToggleButton value={'ALL'} sx={toge1} onClick={e => handleTogge('')}>
              All
            </ToggleButton>
          )}
          {shopInfor?.prodcutSell &&
            shopInfor?.prodcutSell.length &&
            shopInfor.prodcutSell.map((item, idx) => (
              <ToggleButton
                key={idx}
                value={item.id}
                onClick={e => handleTogge(item.nameProduct?.toUpperCase() as string)}
                sx={toge2}>
                {item.nameProduct}
              </ToggleButton>
            ))}
          <ToggleButton value={'ADD'} sx={toge2} onClick={() => setAddItem(!addItem)}>
            Ad
          </ToggleButton>
        </ToggleButtonGroup>
      )}
      {addItem && <CardAddItem setAddItem={setAddItem} resetDataRefItems={resetDataRefItems} />}
      <Grid container columns={{ xs: 6, sm: 12, md: 12 }} spacing={1}>
        {renderListItems}
      </Grid>
      {listItems?.items && listItems.items.length > 0 && (
        <Box textAlign={'center'} mt={2}>
          <IconButton
            disabled={!listItems?.nextPage}
            onClick={() =>
              dispatch(
                ItemSlice.actions.getListsItems({
                  id: shopInfor?.id,
                  nextPage: listItems?.nextPage,
                }),
              )
            }>
            <ExpandCircleDown />
          </IconButton>
          {items.length} / {listItems?.total || 0}
        </Box>
      )}
    </Box>
  );
};

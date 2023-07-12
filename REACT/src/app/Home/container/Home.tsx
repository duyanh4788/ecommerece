/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import * as GuestSlice from 'store/guest/shared/slice';
import * as GuestSelector from 'store/guest/shared/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { Loading } from 'commom/loading';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { ProductsInterface } from 'interface/guests.model';
import { Info, ShoppingCartSharp } from '@mui/icons-material';
import { AppHelper } from 'utils/app.helper';
import { BANNER_SHOP } from 'commom/common.contants';

export const Home = () => {
  const dispatch = useDispatch();
  const loading = useSelector(GuestSelector.selectLoading);
  const listProdsItems = useSelector(GuestSelector.selectListProdsItems);
  const [prodsItems, setProdsItems] = useState<ProductsInterface[]>([]);

  useEffect(() => {
    dispatch(GuestSlice.actions.getListProdsItems());
  }, []);

  useEffect(() => {
    function initListItem(data) {
      if (!data || !data.length) return;
      if (!prodsItems.length) {
        setProdsItems(data);
        return;
      }
      setProdsItems([...prodsItems, ...data]);
      return;
    }
    initListItem(listProdsItems);
  }, [listProdsItems]);

  const renderListItems = useMemo(() => {
    if (!listProdsItems?.length) return null;
    return listProdsItems.map((prod, idx) => {
      return (
        <Accordion key={idx} expanded>
          <AccordionSummary
            aria-controls="panel1a-content"
            id="panel1a-header"
            expandIcon={
              <Chip
                label="view all"
                variant="outlined"
                sx={{ cursor: 'pointer' }}
                onClick={() => dispatch(GuestSlice.actions.getListItemsByProId(prod.id))}
              />
            }>
            <Chip
              avatar={<Avatar src={prod.avatar} alt={prod.avatar} />}
              label={prod.nameProduct}
              variant="outlined"
            />
          </AccordionSummary>
          <AccordionDetails>
            <Grid container columns={{ xs: 6, sm: 12, md: 12 }} spacing={1}>
              {prod.items?.map((item, idx) => {
                return (
                  <Grid item xs={6} sm={3} md={2} key={idx}>
                    <Card className="card_profile">
                      <CardHeader
                        action={
                          <IconButton>
                            <Info sx={{ fontSize: '15px' }} color="info" />
                          </IconButton>
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
                      <CardContent sx={{ padding: '0', paddingBottom: '0 !important' }}>
                        <Box
                          display={'flex'}
                          p={1}
                          justifyContent={'space-between'}
                          alignItems={'center'}>
                          <Typography
                            variant="caption"
                            display="block"
                            gutterBottom
                            margin={0}
                            lineHeight={0}>
                            Sold: {item?.quantitySold}{' '}
                          </Typography>
                          <Chip label={`${item.prices} $`} size="small" variant="outlined" />
                        </Box>
                        <Box textAlign={'center'}>
                          <ShoppingCartSharp
                            fontSize="medium"
                            color="success"
                            sx={{ cursor: 'pointer' }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </AccordionDetails>
        </Accordion>
      );
    });
  }, [prodsItems]);
  return (
    <Box m={2}>
      {loading && <Loading />}
      {renderListItems}
    </Box>
  );
};

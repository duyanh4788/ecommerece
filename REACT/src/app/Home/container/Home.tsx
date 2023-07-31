/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import * as GuestSlice from 'store/guest/shared/slice';
import * as GuestSelector from 'store/guest/shared/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { Loading } from 'commom/loading';
import { ProductsInterface } from 'interface/guests.model';
import { ListItems } from '../component/ListItems';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Chip,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    return listProdsItems.map(prod => {
      return (
        <Accordion key={prod.id} expanded>
          <AccordionSummary
            aria-controls="panel1a-content"
            id="panel1a-header"
            expandIcon={
              <Chip
                label="view all"
                variant="outlined"
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(`/product-details/${prod.id}`)}
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
              <ListItems items={prod?.items || []} />
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

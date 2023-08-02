import { useEffect, useState } from 'react';
import { PATH_PARAMS } from 'commom/common.contants';
import * as GuestSlice from 'store/guest/shared/slice';
import * as GuestSelector from 'store/guest/shared/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ListItems } from '../component/ListItems';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Chip,
  Grid,
  IconButton,
} from '@mui/material';
import { Loading } from 'commom/loading';
import { ExpandCircleDown } from '@mui/icons-material';
import { ProductsInterface } from 'interface/guests.model';
import { RootStore } from 'store/configStore';
import { Unsubscribe } from 'redux';

export const ProductDetails = () => {
  const { prodId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(GuestSelector.selectLoading);
  const listProdsItem = useSelector(GuestSelector.selectListProdsItem);
  const [prodsItem, setProdsItem] = useState<ProductsInterface | null>(null);

  useEffect(() => {
    function initProductDetail(params: string) {
      if (!params) {
        return navigate(PATH_PARAMS.HOME);
      }
      dispatch(GuestSlice.actions.getListItemsByProId({ prodId: params }));
      return;
    }
    initProductDetail(prodId as string);

    const storeSub$: Unsubscribe = RootStore.subscribe(() => {
      const { type } = RootStore.getState().lastAction;
      switch (type) {
        case GuestSlice.actions.getListProdsItemsFail.type:
          navigate(PATH_PARAMS.HOME);
          break;
        default:
          break;
      }
    });

    return () => {
      storeSub$();
      dispatch(GuestSlice.actions.clearData());
      setProdsItem(null);
    };
  }, []);

  useEffect(() => {
    function initListItem(data) {
      if (!data || !data.items.length) return;
      if (!prodsItem?.items?.length) {
        setProdsItem(data);
      } else {
        setProdsItem(prevState => ({
          ...data,
          items: [...(prevState?.items ?? []), ...data.items],
        }));
      }
    }
    initListItem(listProdsItem);
  }, [listProdsItem]);

  return (
    <Box m={2}>
      {loading && <Loading />}
      <Accordion expanded>
        <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
          <Chip
            avatar={<Avatar src={prodsItem?.avatar} alt={prodsItem?.avatar} />}
            label={prodsItem?.nameProduct}
            variant="outlined"
          />
        </AccordionSummary>
        <AccordionDetails>
          <Grid container columns={{ xs: 6, sm: 12, md: 12 }} spacing={1}>
            <ListItems items={prodsItem?.items || []} />
          </Grid>
        </AccordionDetails>
      </Accordion>
      {prodsItem?.items && prodsItem.items.length > 0 && (
        <Box textAlign={'center'} mt={2}>
          <IconButton
            disabled={!prodsItem?.nextPage}
            onClick={() =>
              dispatch(
                GuestSlice.actions.getListItemsByProId({
                  prodId,
                  nextPage: prodsItem?.nextPage,
                }),
              )
            }>
            <ExpandCircleDown />
          </IconButton>
          {prodsItem?.items.length} / {prodsItem?.total || 0}
        </Box>
      )}
    </Box>
  );
};

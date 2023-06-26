import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/core/types';
import { initialState } from './slice';

const selectShop = (state: RootState) => state?.shop || initialState;

export const selectLoading = createSelector([selectShop], state => state.loading);

export const selectSuccess = createSelector([selectShop], state => state.success);

export const selectError = createSelector([selectShop], state => state.error);

export const selectShops = createSelector([selectShop], state => state.shops);

export const selectShopInfor = createSelector([selectShop], state => state.shopInfor);

export const selectProducts = createSelector([selectShop], state => state.prodcuts);

export const selectUrl = createSelector([selectShop], state => state.url);

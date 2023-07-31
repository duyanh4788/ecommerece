import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/core/types';
import { initialState } from './slice';

const selectGuest = (state: RootState) => state?.guest || initialState;

export const selectLoading = createSelector([selectGuest], state => state.loading);

export const selectSuccess = createSelector([selectGuest], state => state.success);

export const selectError = createSelector([selectGuest], state => state.error);

export const selectListProdsItems = createSelector([selectGuest], state => state.listProdsItems);

export const selectListProdsItem = createSelector([selectGuest], state => state.listProdsItem);

export const selectListItems = createSelector([selectGuest], state => state.listItems);

export const selectItemInfor = createSelector([selectGuest], state => state.itemsInfor);

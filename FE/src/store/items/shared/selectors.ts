import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/core/types';
import { initialState } from './slice';

const selectItems = (state: RootState) => state?.item || initialState;

export const selectLoading = createSelector([selectItems], state => state.loading);

export const selectSuccess = createSelector([selectItems], state => state.success);

export const selectError = createSelector([selectItems], state => state.error);

export const selectListItems = createSelector([selectItems], state => state.listItems);

export const selectItemInfor = createSelector([selectItems], state => state.itemsInfor);

export const selectUrl = createSelector([selectItems], state => state.url);

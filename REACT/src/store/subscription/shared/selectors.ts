import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/core/types';
import { initialState } from './slice';

const selectSubscriptions = (state: RootState) => state?.subscription || initialState;

export const selectLoading = createSelector([selectSubscriptions], state => state.loading);

export const selectSuccess = createSelector([selectSubscriptions], state => state.success);

export const selectError = createSelector([selectSubscriptions], state => state.error);

export const selectSubscription = createSelector(
  [selectSubscriptions],
  state => state.subscription,
);

export const selectInvoices = createSelector([selectSubscriptions], state => state.invoices);

export const selectPlans = createSelector([selectSubscriptions], state => state.plans);

export const selectLink = createSelector([selectSubscriptions], state => state.links);

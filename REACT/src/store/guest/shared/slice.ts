import { ItemsInterface, ListItemsInterface } from 'interface/Items.mode';
import { ProductsInterface } from 'interface/guests.model';
import { createSlice } from 'store/core/@reduxjs/toolkit';

export interface GuestState {
  loading: boolean;
  success: boolean;
  error: boolean;
  listProdsItems: ProductsInterface[];
  listProdsItem: ProductsInterface | null;
  listItems: ListItemsInterface | null;
  itemsInfor: ItemsInterface | null;
}

export const initialState: GuestState = {
  loading: false,
  success: false,
  error: false,
  listProdsItems: [],
  listProdsItem: null,
  listItems: null,
  itemsInfor: null,
};

const GuestSlice = createSlice({
  name: 'guest',
  initialState,
  reducers: {
    getListProdsItems(state) {
      state.loading = true;
    },
    getListProdsItemsSuccess(state, action) {
      state.loading = false;
      state.listProdsItems = action.payload.data;
    },
    getListProdsItemsFail(state, action) {
      state.loading = false;
      state.error = true;
    },

    getListItemsByProId(state, action) {
      state.loading = true;
    },
    getListItemsByProIdSuccess(state, action) {
      state.loading = false;
      state.listProdsItem = action.payload.data;
    },
    getListItemsByProIdFail(state, action) {
      state.loading = false;
      state.error = true;
    },

    getItemById(state, action) {
      state.loading = true;
    },
    getItemByIdSuccess(state, action) {
      state.loading = false;
      state.itemsInfor = action.payload.data;
    },
    getItemByIdFail(state, action) {
      state.loading = false;
      state.error = true;
    },

    clearListProdsItems(state) {
      state.listProdsItems = [];
    },

    clearListItems(state) {
      state.listItems = null;
    },

    clearItem(state) {
      state.itemsInfor = null;
    },
    clearData(state) {
      state.success = false;
      state.error = false;
      state.listProdsItem = null;
    },
  },
});

export const { actions, reducer, name: sliceKey } = GuestSlice;

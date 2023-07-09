import { ItemsInterface, ListItemsInterface } from 'interface/Items.mode';
import { createSlice } from 'store/core/@reduxjs/toolkit';

export interface ItemState {
  loading: boolean;
  success: boolean;
  error: boolean;
  listItems: ListItemsInterface | null;
  itemsInfor: ItemsInterface | null;
  url: Array<any>;
}

export const initialState: ItemState = {
  loading: false,
  success: false,
  error: false,
  listItems: null,
  itemsInfor: null,
  url: [],
};

const ItemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    createdItem(state, action) {
      state.loading = true;
    },
    createdItemSuccess(state, action) {
      state.loading = false;
      state.listItems = action.payload.data;
    },
    createdItemFail(state, action) {
      state.loading = false;
      state.error = true;
    },

    updatedItem(state, action) {
      state.loading = true;
    },
    updatedItemSuccess(state, action) {
      state.loading = false;
      state.listItems = action.payload.data;
    },
    updatedItemFail(state, action) {
      state.loading = false;
      state.error = true;
    },

    updatedThumb(state, action) {
      state.loading = true;
    },
    updatedThumbSuccess(state, action) {
      state.loading = false;
      state.success = true;
    },
    updatedThumbFail(state, action) {
      state.loading = false;
      state.error = true;
    },

    deletedItem(state) {
      state.loading = true;
    },
    deletedItemSuccess(state, action) {
      state.loading = false;
      state.listItems = action.payload.data;
    },
    deletedItemFail(state, action) {
      state.loading = false;
      state.error = true;
    },

    getListsItems(state, action) {
      state.loading = true;
    },
    getListsItemsSuccess(state, action) {
      state.loading = false;
      state.listItems = action.payload.data;
    },
    getListsItemsFail(state, action) {
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

    uploadFile(state, action) {
      state.loading = true;
    },
    uploadFileSuccess(state, action) {
      state.loading = false;
      state.url = action.payload.data;
    },
    uploadFileFail(state, action) {
      state.loading = false;
      state.error = true;
    },

    removeFile(state, action) {
      state.loading = true;
    },
    removeFileSuccess(state, action) {
      state.loading = false;
      state.success = true;
    },
    removeFileFail(state, action) {
      state.loading = false;
      state.error = true;
    },

    clearListItems(state) {
      state.listItems = null;
    },

    clearItem(state) {
      state.itemsInfor = null;
    },

    clearUrl(state) {
      state.url = [];
    },

    clearData(state) {
      state.success = false;
      state.error = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = ItemSlice;

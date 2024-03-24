import { call, put, takeLatest, all, select } from 'redux-saga/effects';
import { actions } from './slice';
import { configResponse, configResponseError } from 'services/request';
import { ItemHttp } from '../service/item.http';
import { ItemsInterface, TypeSaga } from 'interface/Items.mode';

const itemRequest = new ItemHttp();

export function* createdItem(api, action) {
  try {
    const resPonse = yield call(api.createdItem, action.payload);
    const data = yield configResponse(resPonse);
    const newData = yield configListItems(TypeSaga.CREATED, data.data);
    const dataSuccess = { ...data, data: newData };
    console.log(dataSuccess);
    yield put(actions.createdItemSuccess(dataSuccess));
  } catch (error) {
    yield put(actions.createdItemFail(configResponseError(error)));
  }
}

export function* updatedItem(api, action) {
  try {
    const resPonse = yield call(api.updatedItem, action.payload);
    const data = yield configResponse(resPonse);
    const newData = yield configListItems(TypeSaga.UPDATED, data.data);
    const dataSuccess = { ...data, data: newData };
    yield put(actions.updatedItemSuccess(dataSuccess));
  } catch (error) {
    yield put(actions.updatedItemFail(configResponseError(error)));
  }
}

export function* deletedItem(api, action) {
  try {
    const resPonse = yield call(api.deletedItem, action.payload);
    const data = yield configResponse(resPonse);
    const newData = yield configListItems(TypeSaga.DELETED, data.data);
    const dataSuccess = { ...data, data: newData };
    yield put(actions.deletedItemSuccess(dataSuccess));
  } catch (error) {
    yield put(actions.deletedItemFail(configResponseError(error)));
  }
}

export function* updatedThumb(api, action) {
  try {
    const resPonse = yield call(api.updatedThumb, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.updatedThumbSuccess(data));
  } catch (error) {
    yield put(actions.updatedThumbFail(configResponseError(error)));
  }
}

export function* getListsItems(api, action) {
  try {
    const resPonse = yield call(api.getListsItems, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.getListsItemsSuccess(data));
  } catch (error) {
    yield put(actions.getListsItemsFail(configResponseError(error)));
  }
}

export function* getItemById(api, action) {
  try {
    const resPonse = yield call(api.getItemById, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.getItemByIdSuccess(data));
  } catch (error) {
    yield put(actions.getItemByIdFail(configResponseError(error)));
  }
}

export function* uploadFile(api, action) {
  try {
    const resPonse = yield call(api.uploadFile, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.uploadFileSuccess(data));
  } catch (error) {
    yield put(actions.uploadFileFail(configResponseError(error)));
  }
}

export function* removeFile(api, action) {
  try {
    const resPonse = yield call(api.removeFile, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.removeFileSuccess(data));
  } catch (error) {
    yield put(actions.removeFileFail(configResponseError(error)));
  }
}

export function* ItemSaga() {
  yield all([
    yield takeLatest(actions.createdItem.type, createdItem, itemRequest),
    yield takeLatest(actions.updatedItem.type, updatedItem, itemRequest),
    yield takeLatest(actions.updatedThumb.type, updatedThumb, itemRequest),
    yield takeLatest(actions.deletedItem.type, deletedItem, itemRequest),
    yield takeLatest(actions.getListsItems.type, getListsItems, itemRequest),
    yield takeLatest(actions.getItemById.type, getItemById, itemRequest),
    yield takeLatest(actions.uploadFile.type, uploadFile, itemRequest),
    yield takeLatest(actions.removeFile.type, removeFile, itemRequest),
  ]);
}

function* configListItems(type: string, data: ItemsInterface) {
  const listItems = yield select(state => state.item.listItems);
  if (!listItems) return;
  if (type === TypeSaga.CREATED) {
    const result = [{ ...data, isAdd: true }, ...listItems.items];
    return { ...listItems, items: result, total: listItems.total + 1, typeSaga: TypeSaga.CREATED };
  }
  if (type === TypeSaga.UPDATED) {
    const filter = listItems.items.filter(item => item.id !== data.id);
    const result = [{ ...data }, ...filter];
    return { ...listItems, items: result, typeSaga: TypeSaga.UPDATED };
  }
  if (type === TypeSaga.DELETED) {
    const result = listItems.items.filter(item => item.id !== data.id);
    return {
      ...listItems,
      items: result,
      total: listItems.total ? listItems.total - 1 : 0,
      typeSaga: TypeSaga.DELETED,
    };
  }
}

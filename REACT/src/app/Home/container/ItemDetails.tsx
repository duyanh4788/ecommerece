import { PATH_PARAMS } from 'commom/common.contants';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as GuestSlice from 'store/guest/shared/slice';

export const ItemDetails = () => {
  const { itemId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    function initItemId(data: string) {
      if (!data) {
        navigate(PATH_PARAMS.HOME);
        return;
      }
      dispatch(GuestSlice.actions.getItemById(itemId));
    }
    initItemId(itemId as string);
  }, []);
  return <h1>item detail</h1>;
};

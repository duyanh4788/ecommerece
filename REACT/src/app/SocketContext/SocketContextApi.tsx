/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useInjectSlicesAndSagas } from 'store/core/map/mapServices';
import { Socket, io } from 'socket.io-client';
import { TypePushlisher, ResponseNotify, SOCKET_COMMIT, TYPE_SOCKET } from 'commom/socket_commit';
import { CONFIG_ENV } from 'utils/config';
import * as _ from 'lodash';
import { toast } from 'react-toastify';
import { LocalStorageKey, TypeLocal } from 'services/localStorage';
import { localStorage } from 'hooks/localStorage/LocalStorage';
import * as ShopSlice from 'store/shops/shared/slice';
import * as SubscriptionSlice from 'store/subscription/shared/slice';

export const SocketContext = React.createContext({});
export const SocketContextProvider = ({ children }) => {
  useInjectSlicesAndSagas();
  const dispatch = useDispatch();
  const userInfor = localStorage(TypeLocal.GET, LocalStorageKey.user);
  const shopId = localStorage(TypeLocal.GET, LocalStorageKey.shopId);
  const socket: Socket | any = useRef<Socket>(null);
  const PORT_SOCKET: string = CONFIG_ENV.SOCKET_URL as string;

  useEffect(() => {
    if (userInfor) {
      socket.current = io(PORT_SOCKET, {
        transports: ['websocket'],
        auth: {
          Authorization: _.get(userInfor, 'toKen'),
        },
      });

      const connectionUser = { type: TYPE_SOCKET.USER, id: userInfor.userId };
      const connectionShop = { type: TYPE_SOCKET.SHOP, id: shopId };

      const handleBeforeUnload = () => {
        socket.current.emit(SOCKET_COMMIT.DISCONNECTED, connectionUser);
        socket.current.emit(SOCKET_COMMIT.DISCONNECTED, connectionShop);
      };
      window.addEventListener('beforeunload', handleBeforeUnload);

      socket.current.emit(SOCKET_COMMIT.JOIN_ROOM, connectionUser);
      socket.current.emit(SOCKET_COMMIT.JOIN_ROOM, connectionShop);

      socket.current.on(SOCKET_COMMIT.SEND_MESSAGE_NOTIFY, (response: ResponseNotify) => {
        if (!response || !response.messages || !response.shopId) return;
        handleCalAPIResponse(response);
        return toast.success(response.messages);
      });
      return () => {
        socket.current.emit(SOCKET_COMMIT.DISCONNECTED, connectionUser);
        socket.current.emit(SOCKET_COMMIT.DISCONNECTED, connectionShop);
        socket.current.disconnect();
      };
    }
  }, [PORT_SOCKET, userInfor]);

  const handleCalAPIResponse = (response: ResponseNotify) => {
    switch (response.type) {
      case TypePushlisher.SUBSCRIPTION || TypePushlisher.ADMIN:
        dispatch(ShopSlice.actions.getListsShop());
        dispatch(ShopSlice.actions.getShopById(response.shopId));
        dispatch(SubscriptionSlice.actions.shopGetSubscription(response.shopId));
        break;
      case TypePushlisher.INVOICES:
        dispatch(SubscriptionSlice.actions.shopGetInvoices(response.shopId));
        break;
      case TypePushlisher.WAIT_SUBSCRIPTION:
        dispatch(SubscriptionSlice.actions.shopGetSubscription(response.shopId));
        break;
      default:
        break;
    }
  };

  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
};

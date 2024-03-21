/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import * as AuthSelector from 'store/auth/shared/selectors';
import { useInjectSlicesAndSagas } from 'store/core/map/mapServices';
import { Socket, io } from 'socket.io-client';
import { Connections, SOCKET_COMMIT, TYPE_SOCKET } from 'commom/socket_commit';
import { CONFIG_ENV } from 'utils/config';
import * as _ from 'lodash';
import { toast } from 'react-toastify';
import { LocalStorageKey, TypeLocal } from 'services/localStorage';
import { localStorage } from 'hooks/localStorage/LocalStorage';

export const SocketContext = React.createContext({});
export const SocketContextProvider = ({ children }) => {
  useInjectSlicesAndSagas();
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

      const connectionUser = { type: 'USER', id: userInfor.userId };
      const connectionShop = { type: 'SHOP', id: shopId };

      const handleBeforeUnload = () => {
        socket.current.emit(SOCKET_COMMIT.DISCONNECTED, connectionUser);
        socket.current.emit(SOCKET_COMMIT.DISCONNECTED, connectionShop);
      };
      window.addEventListener('beforeunload', handleBeforeUnload);

      socket.current.emit(SOCKET_COMMIT.JOIN_ROOM, connectionUser);
      socket.current.emit(SOCKET_COMMIT.JOIN_ROOM, connectionShop);

      socket.current.on(SOCKET_COMMIT.SEND_MESSAGE_NOTIFY, (response: any) => {
        console.log(response);
        if (response.code === 200) {
          return toast.success(response.messages || 'wellcome to Ecommerce Anh Vu');
        } else {
          return toast.error(response.messages || 'please try again later');
        }
      });
      return () => {
        socket.current.emit(SOCKET_COMMIT.DISCONNECTED, connectionUser);
        socket.current.emit(SOCKET_COMMIT.DISCONNECTED, connectionShop);
        socket.current.disconnect();
      };
    }
  }, [PORT_SOCKET, userInfor]);

  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
};

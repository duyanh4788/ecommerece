export const SOCKET_COMMIT = {
  JOIN_ROOM: 'join_room',
  SEND_MESSAGE: 'send_message',
  SEND_CONNECTION: 'send_connection',
  SEND_LOCATION: 'send_location',
  SEND_MESSAGE_NOTIFY: 'send_message_notify',
  SEND_MESSAGE_SENDER: 'send_message_sender',
  SEND_LIST_USERS: 'send_list_users',
  CHANGE_STATUS_ONLINE: 'change_status_online',
  CHANGE_STATUS_OFFLINE: 'change_status_offline',
  CHANGE_STATUS_ISNEWMSG: 'change_status_isnewmsg',
  DISCONNECTED: 'disconnected',
  CONNECT_ERROR: 'connect_error',
};

export enum TYPE_SOCKET {
  USER = 'USER',
  SHOP = 'SHOP',
}

export interface Connections {
  type: string;
  id: string;
  index: number;
}

export enum TypePushlisher {
  SUBSCRIPTION = 'SUBSCRIPTION',
  WAIT_SUBSCRIPTION = 'WAIT_SUBSCRIPTION',
  INVOICES = 'INVOICES',
  ADMIN = 'ADMIN',
}

export interface ResponseNotify {
  userId: string;
  shopId: string;
  messages: string;
  type: TypePushlisher;
}

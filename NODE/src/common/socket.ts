export const SOCKET_COMMIT = {
  CONNECT: 'connect',
  JOIN_ROOM: 'join_room',
  SEND_MESSAGE: 'send_message',
  SEND_CONNECTION: 'send_connection',
  SEND_MESSAGE_NOTIFY: 'send_message_notify',
  SEND_MESSAGE_SENDER: 'send_message_sender',
  SEND_LIST_USERS: 'send_list_users',
  CHANGE_STATUS_ONLINE: 'change_status_online',
  CHANGE_STATUS_OFFLINE: 'change_status_offline',
  CHANGE_STATUS_ISNEWMSG: 'change_status_isnewmsg',
  MESSAGE_NOT_AVALID: 'Xin đừng chửi láo',
  DISCONNECTED: 'disconnected'
};

export const TYPE_CONNECTION_SOCKET = {
  SHOP: 'SHOP',
  USER: 'USER'
};

export interface Connections {
  type: string;
  id: string;
}

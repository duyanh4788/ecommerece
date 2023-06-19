export const TitleModel = {
  LIST_MESSAGES: "ListMessages",
  MESSAGES: "Messages",
  USERS: "Users",
  ROOM: "Room",
  CONVERTSTATIONS: "Convertstations",
  AUTHENTICATOR: "Authenticators",
  AUTHENTICATOR_APP: "AuthenticatorsApp",
};

export const SOCKET_COMMIT = {
  CONNECT: "connect",
  JOIN_ROOM: "join_room",
  SEND_MESSAGE: "send_message",
  SEND_LIST_MESSAGE: "send_list_message",
  SEND_MESSAGE_NOTIFY: "send_message_notify",
  SEND_MESSAGE_SENDER: "send_message_sender",
  SEND_LIST_USERS: "send_list_users",
  CHANGE_STATUS_ONLINE: "change_status_online",
  CHANGE_STATUS_OFFLINE: "change_status_offline",
  CHANGE_STATUS_ISNEWMSG: "change_status_isnewmsg",
  MESSAGE_NOT_AVALID: "Xin đừng chửi láo",
  DISCONNECTED: "disconnected",
};

export const USER_TYPE_CODE = ["ADMIN", "SUPER_ADMIN"];
export const SECRETKEY = "AVNS_j7_KjsKPnwenqxCC4eA";

export enum ModelRedis {
  USERS_GETBYID = "users_getbyid",
  MESSAGES = "messages",
  CONVERTSTATIONS = "converstations",
  AUTHENTICATORS = "authenticators",
}

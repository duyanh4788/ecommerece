import { ApisauceInstance } from 'apisauce';
import { Messages, PostConvertStation } from 'interface/ChatApp.model';
import { ChatAppApi } from 'store/chatApp/constants/chatapp.constant';
import { ApiRouter } from 'services/request.constants';
import { HttpRequest } from 'services/request';

export class ChatAppHttp {
  request: ApisauceInstance;
  constructor(endPoint = ApiRouter.CHAT_APP_API) {
    this.request = new HttpRequest(endPoint).request;
  }

  private configNewMessage = (message: Messages) => {
    return {
      conversationId: message.conversationId,
      senderId: message.senderId,
      reciverId: message.reciverId,
      text: message.text,
    };
  };

  private configConverStation = (users: PostConvertStation) => {
    return {
      senderId: users.senderId,
      reciverId: users.reciverId,
    };
  };

  public getListUsers = (): Promise<any> => this.request.get(ChatAppApi.LIST_USER);

  public saveConvertStation = (data: PostConvertStation): Promise<any> =>
    this.request.post(ChatAppApi.SAVE_CONVERT_STATION, {
      ...this.configConverStation(data),
    });

  public getListMessages = (sernderId: any): Promise<any> => {
    return this.request.post(ChatAppApi.GET_LIST_MESSAGE, sernderId);
  };

  public postNewMessage = (data: Messages): Promise<any> =>
    this.request.post(ChatAppApi.NEW_MESSAGE, {
      ...this.configNewMessage(data),
    });

  public changeStatusoffline = (id: string): Promise<any> =>
    this.request.post(ChatAppApi.CHANGE_STATUS_OFFLINE, id);

  public postUploadAWS3 = (data: FormData): Promise<any> =>
    this.request.post(ChatAppApi.UPLOAD_AWS_S3, data);

  public removeUploadAWS3 = (idImage: any): Promise<any> =>
    this.request.post(ChatAppApi.REMOVE_IMG_AWS3, idImage);
}

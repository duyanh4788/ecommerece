import { Router } from 'express';
import { MapServices } from '../../infrastructure/MapServices';

const BASE_ROUTE = '/upload';

enum Routes {
  UPLOAD_FILE = '/upload-file'
}

export class UploadRouter {
  private verifyTokenMiddleware: MapServices['verifyTokenMiddleware'] = new MapServices().verifyTokenMiddleware;
  private multerMiddleware: MapServices['multerMiddleware'] = new MapServices().multerMiddleware;
  private uploadcontroller: MapServices['uploadcontroller'] = new MapServices().uploadcontroller;
  constructor() {}

  public routes(app: Router): void {
    app.post(BASE_ROUTE + Routes.UPLOAD_FILE, this.verifyTokenMiddleware.auThenticate, this.multerMiddleware.uploadMulter, this.uploadcontroller.uploadFile);
  }
}

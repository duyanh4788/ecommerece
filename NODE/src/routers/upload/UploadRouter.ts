import { Router } from 'express';
import { MapServices } from '../../infrastructure/MapServices';

const BASE_ROUTE = '/upload';

enum Routes {
  UPLOAD_FILE = '/upload-file',
  REMOVE_FILE = '/remove-file'
}

export class UploadRouter {
  private verifyTokenMiddleware: MapServices['verifyTokenMiddleware'] = new MapServices().verifyTokenMiddleware;
  private multerMiddleware: MapServices['multerMiddleware'] = new MapServices().multerMiddleware;
  private uploadcontroller: MapServices['uploadcontroller'] = new MapServices().uploadcontroller;
  constructor() {}

  public routes(app: Router): void {
    app.post(BASE_ROUTE + Routes.UPLOAD_FILE, this.verifyTokenMiddleware.authenticate, this.multerMiddleware.uploadMulter, this.uploadcontroller.uploadFile);
    app.post(BASE_ROUTE + Routes.REMOVE_FILE, this.verifyTokenMiddleware.authenticate, this.uploadcontroller.removeFile);
  }

  public getUploadRouter(): Router {
    const uploadRouter = Router();
    this.routes(uploadRouter);
    return uploadRouter;
  }
}

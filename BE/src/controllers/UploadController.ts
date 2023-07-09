import { Request, Response } from 'express';
import { SendRespone } from '../services/success/success';
import { RestError } from '../services/error/error';
import fs from 'fs';
import { TypeOfValue, isCheckedTypeValues } from '../utils/validate';
import { removeFile } from '../utils/removeFile';
export class Uploadcontroller {
  public uploadFile = async (req: Request, res: Response) => {
    try {
      if (!req.files.length) {
        throw new RestError('upload failed.', 404);
      }
      const fileList = req.files as Express.Multer.File[];
      let url: string[] = [];
      await Promise.all(
        fileList.map(async (item) => {
          if (item.path.includes('.mp4')) {
            url.push(process.env.END_POINT_VIDEOS_PATH + item.path);
          }
          if (!item.path.includes('.mp4')) {
            url.push(process.env.END_POINT_IMAGES_PATH + item.path);
          }
        })
      );
      return new SendRespone({ data: url, message: 'upload successfullly.' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public removeFile = async (req: Request, res: Response) => {
    try {
      const { idImage } = req.body;
      if (!idImage || !idImage.length) {
        throw new RestError('invalid request!', 404);
      }
      if (isCheckedTypeValues(idImage, TypeOfValue.ARRAY)) {
        idImage.forEach((item) => removeFile(item));
      } else if (isCheckedTypeValues(idImage, TypeOfValue.STRING)) {
        removeFile(idImage);
      }
      return new SendRespone({ message: 'remove successfullly.' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };
}

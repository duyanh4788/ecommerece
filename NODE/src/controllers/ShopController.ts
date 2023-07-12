import { Request, Response } from 'express';
import { SendRespone } from '../services/success/success';
import { RestError } from '../services/error/error';
import { ShopUseCase } from '../usecase/ShopUseCase';
import { TypeOfValue, isCheckedTypeValues } from '../utils/validate';
import { removeFile } from '../utils/removeFile';

export class ShopController {
  constructor(private shopUseCase: ShopUseCase) {}
  public registedShop = async (req: Request, res: Response) => {
    try {
      const { user } = req;
      await this.shopUseCase.registedShopUseCase(req.body, user.userId);
      return new SendRespone({ message: 'register successfullly!' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public updatedShop = async (req: Request, res: Response) => {
    try {
      const { user } = req;
      await this.shopUseCase.updatedShopUseCase(req.body, user.userId);
      return new SendRespone({ message: 'updated successfullly.' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public updatedSliders = async (req: Request, res: Response) => {
    try {
      const { user } = req;
      const { id, sliders, idImageRemove } = req.body;
      if (!isCheckedTypeValues(sliders, TypeOfValue.ARRAY, false) || !isCheckedTypeValues(id, TypeOfValue.STRING) || (idImageRemove && !isCheckedTypeValues(idImageRemove, TypeOfValue.STRING))) {
        throw new RestError('invalid request!', 404);
      }
      await this.shopUseCase.updatedSlidersUseCase(req.body, user.userId);
      if (idImageRemove) {
        removeFile(idImageRemove);
      }
      return new SendRespone({ message: 'updated successfullly.' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public deletedShop = async (req: Request, res: Response) => {
    try {
      const { user } = req;
      const { id } = req.body;
      if (!id) {
        throw new RestError('shop not available!', 404);
      }
      await this.shopUseCase.deletedShopUseCase(id, user.userId);
      return new SendRespone({ message: 'deleted successfullly.' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public getListsShop = async (req: Request, res: Response) => {
    try {
      const { user } = req;
      const shops = await this.shopUseCase.getListsShopUseCase(user.userId);
      return new SendRespone({ data: shops }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public getShopById = async (req: Request, res: Response) => {
    try {
      const { shopId } = req.params;
      if (!shopId) {
        throw new RestError('shop not available!', 404);
      }
      const { user } = req;
      const shop = await this.shopUseCase.getShopByIdUseCase(shopId, user.userId);
      return new SendRespone({ data: shop }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public adminUpdateStatusShop = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      if (!isCheckedTypeValues(id, TypeOfValue.STRING)) {
        throw new RestError('shop id not available!', 404);
      }
      await this.shopUseCase.updateStatusShopUseCase(id, true);
      return new SendRespone({ message: 'approved successfullly.' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public adminGetListsShop = async (req: Request, res: Response) => {
    try {
      const { user } = req;
      const shops = await this.shopUseCase.getListsShopUseCase(user.userId, user.roleId);
      return new SendRespone({ data: shops }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public adminGetShopById = async (req: Request, res: Response) => {
    try {
      const { shopId } = req.params;
      if (!shopId) {
        throw new RestError('shop not available!', 404);
      }
      const { user } = req;
      const shop = await this.shopUseCase.getShopByIdUseCase(shopId, user.userId, user.roleId);
      return new SendRespone({ data: shop }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };
}

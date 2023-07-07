import { Request, Response } from 'express';
import { SendRespone } from '../services/success/success';
import { RestError } from '../services/error/error';
import { ItemsUseCase } from '../usecase/ItemsUseCase';
import { sequelize } from '../database/sequelize';
import { ItemRequest } from './request/ItemsRequest';

export class ItemsController {
  constructor(private itemsUseCase: ItemsUseCase) {}
  public getListsItems = async (req: Request, res: Response) => {
    try {
      const { shopId } = req.params;
      if (!shopId) {
        throw new RestError('shop not available', 404);
      }
      const { page, pageSize, options } = req.query;
      const configPage = Number(page) || 1;
      const configPageSzie = Number(pageSize) || 10;
      const items = await this.itemsUseCase.getListsItemsUseCase(shopId, configPage, configPageSzie, String(options));
      return new SendRespone({ data: items }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public getItemsById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new RestError('items not available', 404);
      }
      const item = await this.itemsUseCase.getItemsByIdUseCase(id);
      return new SendRespone({ data: item }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public createdItems = async (req: Request, res: Response) => {
    const transactionDB = await sequelize.transaction();
    try {
      const [items, payloadEntity] = await new ItemRequest().validateObject(req.body.items, req.body.payloadEntity);
      await this.itemsUseCase.createdItemsUseCase(items, payloadEntity, transactionDB);
      await transactionDB.commit();
      return new SendRespone({ message: 'created successfullly.' }).send(res);
    } catch (error) {
      await transactionDB.rollback();
      return RestError.manageServerError(res, error, false);
    }
  };

  public updatedItems = async (req: Request, res: Response) => {
    const transactionDB = await sequelize.transaction();
    try {
      const [items, payloadEntity] = await new ItemRequest().validateObject(req.body.items, req.body.payloadEntity);
      await this.itemsUseCase.updatedItemsUseCase(items, payloadEntity, transactionDB);
      await transactionDB.commit();
      return new SendRespone({ message: 'updated successfullly.' }).send(res);
    } catch (error) {
      await transactionDB.rollback();
      return RestError.manageServerError(res, error, false);
    }
  };

  public deletedItems = async (req: Request, res: Response) => {
    const transactionDB = await sequelize.transaction();
    try {
      const { id } = req.body;
      if (!id) {
        throw new RestError('items not available', 404);
      }
      await this.itemsUseCase.deletedItemsUseCase(id, transactionDB);
      await transactionDB.commit();
      return new SendRespone({ message: 'deleted successfullly.' }).send(res);
    } catch (error) {
      await transactionDB.rollback();
      return RestError.manageServerError(res, error, false);
    }
  };
}

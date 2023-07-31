import { Request, Response } from 'express';
import { SendRespone } from '../services/success/success';
import { RestError } from '../services/error/error';
import { ItemsUseCase } from '../usecase/ItemsUseCase';
import { ProductsUseCase } from '../usecase/ProductsUseCase';
import { GuestUseCase } from '../usecase/GuestUseCase';

export class GuestController {
  constructor(private guestUseCase: GuestUseCase, private itemsUseCase: ItemsUseCase, private productsUseCase: ProductsUseCase) {}
  public getListsItems = async (req: Request, res: Response) => {
    try {
      const products = await this.productsUseCase.guestGetListUseCase();
      return new SendRespone({ data: products }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public getListsItemsByProId = async (req: Request, res: Response) => {
    try {
      const { proId } = req.params;
      if (!proId) {
        throw new RestError('item not available', 404);
      }
      const product = await this.productsUseCase.getProductByIdUseCase(proId);
      if (!product) {
        throw new RestError('item not available', 404);
      }
      const { page, pageSize } = req.query;
      const configPage = Number(page) || 1;
      const configPageSzie = Number(pageSize) || 20;
      const items = await this.itemsUseCase.getListsItemsByProdIdUseCase(product.id, configPage, configPageSzie);
      return new SendRespone({ data: { ...items, ...product } }).send(res);
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
}

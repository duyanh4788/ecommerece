import { Request, Response } from 'express';
import { SendRespone } from '../services/success/success';
import { RestError } from '../services/error/error';
import { ProductsUseCase } from '../usecase/ProductsUseCase';

export class ProductsController {
  constructor(private productsUseCase: ProductsUseCase) {}
  public createdProduct = async (req: Request, res: Response) => {
    try {
      await this.productsUseCase.createdProductUseCase(req.body);
      return new SendRespone({ message: 'register successfullly.' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public updatedProduct = async (req: Request, res: Response) => {
    try {
      await this.productsUseCase.updatedProductUseCase(req.body);
      return new SendRespone({ message: 'updated successfullly.' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public deletedProduct = async (req: Request, res: Response) => {
    try {
      await this.productsUseCase.deletedProductUseCase(req.body.productId);
      return new SendRespone({ message: 'deleted successfullly.' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public getListsProducts = async (req: Request, res: Response) => {
    try {
      const listProducts = await this.productsUseCase.getListsProductsUseCase();
      return new SendRespone({ data: listProducts }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public getProductById = async (req: Request, res: Response) => {
    try {
      const { productId } = req.params;
      if (!productId) {
        throw new RestError('product id not available', 404);
      }
      const product = await this.productsUseCase.getProductByIdUseCase(productId);
      return new SendRespone({ data: product }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };
}

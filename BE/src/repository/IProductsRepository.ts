import { ProductsInterface } from '../interface/ProductsInterface';

export interface IProductsRepository {
  created(reqBody: ProductsInterface): Promise<void>;

  updated(reqBody: ProductsInterface): Promise<void>;

  deleted(productId: string): Promise<void>;

  getLists(): Promise<ProductsInterface[]>;

  getProductById(productId: string): Promise<ProductsInterface>;
}

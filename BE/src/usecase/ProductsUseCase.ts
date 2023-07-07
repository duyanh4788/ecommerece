import { IProductsRepository } from '../repository/IProductsRepository';
import { ProductsInterface } from '../interface/ProductsInterface';
import { dataProducts } from '../common/dataProduct';
import { RedisProducts } from '../redis/products/RedisProducts';

export class ProductsUseCase {
  private redisProducts: RedisProducts = new RedisProducts();
  constructor(private productsRepository: IProductsRepository) {}

  async createdProductUseCase(reqBody: ProductsInterface) {
    await Promise.all(
      dataProducts.map(async (item) => {
        await this.productsRepository.created({ nameProduct: item.nameProduct, avatar: item.avatar });
      })
    );
  }

  async updatedProductUseCase(reqBody: ProductsInterface) {
    return await this.productsRepository.updated(reqBody);
  }

  async deletedProductUseCase(productId: string) {
    return await this.productsRepository.deleted(productId);
  }

  async getListsProductsUseCase() {
    return await this.redisProducts.handlerGetProducts();
  }

  async getProductByIdUseCase(productId: string) {
    return await this.redisProducts.handlerGetProductsId(productId);
  }
}

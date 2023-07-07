import { ProductsSequelize } from '../../database/sequelize/ProductsSequelize';
import { MainkeysRedis } from '../../interface/KeyRedisInterface';
import { ProductsInterface } from '../../interface/ProductsInterface';
import { IProductsRepository } from '../../repository/IProductsRepository';
import { redisController } from '../RedisController';

export class RedisProducts {
  private productsRepository: IProductsRepository = new ProductsSequelize();

  public async handlerGetProducts(): Promise<ProductsInterface[]> {
    let productsRedis = await redisController.getRedis(MainkeysRedis.PRODUCTS);
    if (!productsRedis) {
      const products = await this.productsRepository.getLists();
      productsRedis = await redisController.setRedis({ keyValue: MainkeysRedis.PRODUCTS, value: products });
    }
    return productsRedis;
  }

  public async handlerGetProductsId(productId: string): Promise<ProductsInterface> {
    let productRedis = await redisController.getRedis(`${MainkeysRedis.PRODUCT_ID}${productId}`);
    if (!productRedis) {
      const product = await this.productsRepository.getProductById(productId);
      productRedis = await redisController.setRedis({ keyValue: `${MainkeysRedis.PRODUCT_ID}${productId}`, value: product });
    }
    return productRedis;
  }
}

import { deCryptFakeId, enCryptFakeId } from '../../utils/fakeid';
import { IProductsRepository } from '../../repository/IProductsRepository';
import { ProductsInterface } from '../../interface/ProductsInterface';
import { ProductsModel } from '../model/ProductsModel';
import { RestError } from '../../services/error/error';
import { ItemsModel } from '../model/ItemsModel';
import { ItemsInterface } from '../../interface/ItemsInterface';
import { redisController } from '../../redis/RedisController';
import { MainkeysRedis } from '../../interface/KeyRedisInterface';

export class ProductsSequelize implements IProductsRepository {
  private ATTRIBUTES: string[] = ['id', 'nameProduct', 'avatar'];
  async created(reqBody: ProductsInterface): Promise<void> {
    const { nameProduct, avatar } = reqBody;
    await ProductsModel.create({ nameProduct, avatar });
    return;
  }
  async updated(reqBody: ProductsInterface): Promise<void> {
    const { id, nameProduct, status, avatar } = reqBody;
    const find = await ProductsModel.findByPk(deCryptFakeId(id));
    if (!find) throw new RestError('product not availabe!', 404);
    if (nameProduct) {
      find.nameProduct = nameProduct;
    }
    if (status) {
      find.status = status;
    }
    if (avatar) {
      find.avatar = avatar;
    }
    await find.save();
    return;
  }

  async deleted(productId: string): Promise<void> {
    await ProductsModel.destroy({ where: { id: deCryptFakeId(productId) } });
    return;
  }

  async getLists(): Promise<ProductsInterface[]> {
    let productsRedis = await redisController.getRedis(MainkeysRedis.PRODUCTS);
    if (!productsRedis) {
      const products = await ProductsModel.findAll({ attributes: this.ATTRIBUTES });
      productsRedis = await redisController.setRedis({ keyValue: MainkeysRedis.PRODUCTS, value: products.map((item) => this.transformModelToEntity(item)) });
    }
    return productsRedis;
  }

  async getListsWithCondition(): Promise<ProductsInterface[]> {
    const products = await ProductsModel.findAll({
      attributes: this.ATTRIBUTES,
      include: [{ model: ItemsModel, order: [['quantitySold', 'DESC']], limit: 20 }]
    });
    return products.map((item) => this.transformModelToEntity(item));
  }

  async getProductById(productId: string): Promise<ProductsInterface> {
    const key = `${MainkeysRedis.PRODUCT_ID}${productId}`;
    let productRedis = await redisController.getRedis(key);
    if (!productRedis) {
      const product = await ProductsModel.findByPk(deCryptFakeId(productId));
      productRedis = await redisController.setRedis({ keyValue: key, value: this.transformModelToEntity(product) });
    }
    return productRedis;
  }

  async findById(id: number): Promise<ProductsInterface> {
    const product = await ProductsModel.findByPk(id, { attributes: this.ATTRIBUTES });
    return this.transformModelToEntity(product);
  }

  /**
   * Transforms database model into domain entity
   * @param model
   */
  private transformModelToEntity(model: ProductsModel): ProductsInterface {
    if (!model) return;
    const entity: ProductsInterface = {};
    let itemsModel: any[] = model.dataValues.items;
    const keysObj = Object.keys(model.dataValues);

    for (let key of keysObj) {
      if (key !== 'created_at' && key !== 'updated_at') {
        entity[key] = model[key];
      }
    }
    entity.id = enCryptFakeId(entity.id);
    if (itemsModel && itemsModel.length) {
      itemsModel = itemsModel.map((item) => this.transformModelItemToEntity(item));
      return { ...entity, items: itemsModel };
    }
    return entity;
  }

  private transformModelItemToEntity(model: ItemsModel): ItemsInterface {
    if (!model) return;
    const entity: ItemsInterface = {};
    const keysObj = Object.keys(model.dataValues);
    for (let key of keysObj) {
      if (key !== 'created_at' && key !== 'updated_at') {
        entity[key] = model[key];
      }
    }
    entity.id = enCryptFakeId(entity.id);
    entity.shopId = enCryptFakeId(entity.shopId);
    entity.productId = enCryptFakeId(entity.productId);
    return entity;
  }
}

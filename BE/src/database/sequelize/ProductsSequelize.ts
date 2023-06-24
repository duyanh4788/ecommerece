import { deCryptFakeId, enCryptFakeId } from '../../utils/fakeid';
import { IProductsRepository } from '../../repository/IProductsRepository';
import { ProductsInterface } from '../../interface/ProductsInterface';
import { ProductsModel } from '../model/ProductsModel';
import { RestError } from '../../services/error/error';

export class ProductsSequelize implements IProductsRepository {
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
    const products = await ProductsModel.findAll();
    return products.map((item) => this.transformModelToEntity(item));
  }

  async getProductById(productId: string): Promise<ProductsInterface> {
    const product = await ProductsModel.findByPk(deCryptFakeId(productId));
    return this.transformModelToEntity(product);
  }

  async findById(id: number): Promise<ProductsInterface> {
    const product = await ProductsModel.findByPk(id, { attributes: ['id', 'nameProduct', 'avatar'] });
    return this.transformModelToEntity(product);
  }

  /**
   * Transforms database model into domain entity
   * @param model
   */
  private transformModelToEntity(model: ProductsModel): ProductsInterface {
    if (!model) return;
    const entity: ProductsInterface = {};
    const keysObj = Object.keys(model.dataValues);
    for (let key of keysObj) {
      entity[key] = model[key];
    }
    entity.id = enCryptFakeId(entity.id);
    return entity;
  }
}

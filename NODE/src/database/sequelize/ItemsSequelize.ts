import { Op, Transaction } from 'sequelize';
import { deCryptFakeId, enCryptFakeId } from '../../utils/fakeid';
import { IItemsRepository } from '../../repository/IItemsRepository';
import { PayloadEntity, ItemsInterface, ItemsType, ListItemsInterface } from '../../interface/ItemsInterface';
import { ItemsModel } from '../model/ItemsModel';
import { MapItemsServices } from '../../services/EAV/MapItemsServices';
import { EntityValuesModel } from '../model/EAV/EntityValuesModel';
import { RestError } from '../../services/error/error';
import { EntityClothersModel } from '../model/EAV/EntityClothersModel';
import { EntityCosmesticsModel } from '../model/EAV/EntityCosmesticsModel';
import { EntityElectronicsModel } from '../model/EAV/EntityElectronicsModel';
import { EntityFunituresModel } from '../model/EAV/EntityFunituresModel';
import { parseEntityValues } from '../../utils/parseEntityValues';
import { removeFile } from '../../utils/removeFile';
import { ShopsModel } from '../model/ShopsModel';

export class ItemsSequelize implements IItemsRepository {
  private INCLUED = [{ model: EntityClothersModel }, { model: EntityCosmesticsModel }, { model: EntityElectronicsModel }, { model: EntityFunituresModel }];
  constructor(private mapItemsServices: MapItemsServices) {}

  async getListsItems(shopId: string, page: number, pageSize: number, search: any, options: string): Promise<ListItemsInterface> {
    let optionWhere: any = {
      where: { shopId: deCryptFakeId(shopId) }
    };
    if (options) {
      optionWhere.where = { ...optionWhere.where, typeProduct: options };
    }

    if (search || search !== '') {
      optionWhere.where = { ...optionWhere.where, nameItem: { [Op.like]: `%${search}%` } };
    }
    return this.getListWithContition(page, pageSize, optionWhere, 'created_at');
  }

  async getListsItemsByProdId(productId: string, page: number, pageSize: number): Promise<ListItemsInterface> {
    let optionWhere: any = {
      where: { productId: deCryptFakeId(productId) }
    };
    return this.getListWithContition(page, pageSize, optionWhere, 'quantitySold');
  }

  private async getListWithContition(page: number, pageSize: number, optionWhere: any, order: string): Promise<ListItemsInterface> {
    const offset = (page - 1) * pageSize;
    const lists = await ItemsModel.findAndCountAll({
      ...optionWhere,
      order: [[order, 'DESC']],
      offset,
      limit: pageSize
    });
    const items = lists.rows.map((item) => this.transformModelToEntity(item));
    const totalPages = Math.ceil(lists.count / pageSize);
    const nextPage = page < totalPages ? page + 1 : 0;
    return { items, total: lists.count, currentPage: page, pageSize, nextPage };
  }

  async getItemsById(id: string): Promise<ItemsInterface> {
    const find = await ItemsModel.findByPk(deCryptFakeId(id), {
      include: [
        { model: EntityValuesModel, include: this.INCLUED },
        { model: ShopsModel, attributes: ['nameShop', 'banners'] }
      ]
    });
    return this.transformModelToEntity(find);
  }

  async createdItems(payload: ItemsInterface, payloadEntity: PayloadEntity, transactionDB?: Transaction): Promise<ItemsInterface> {
    const { shopId, productId, nameItem, itemThumb, description, brandName, origin, prices, quantityStock, typeProduct } = payload;
    const items = await ItemsModel.create(
      { shopId: deCryptFakeId(shopId), productId: deCryptFakeId(productId), nameItem, itemThumb, description, brandName, origin, typeProduct, prices, quantityStock },
      { transaction: transactionDB }
    );
    const entiyValues = await EntityValuesModel.create({ itemId: items.id }, { transaction: transactionDB });
    const EntityAttsModel = await this.mapItemsServices.getType(typeProduct as ItemsType);
    const payloadEntitys = { ...payloadEntity, entityId: entiyValues.id };
    await EntityAttsModel.create(payloadEntitys, { transaction: transactionDB });
    return this.transformModelToEntity(items);
  }

  async updatedItems(payload: ItemsInterface, payloadEntity: PayloadEntity, transactionDB?: Transaction): Promise<ItemsInterface> {
    const { id, nameItem, itemThumb, description, brandName, origin, prices, quantityStock } = payload;
    const item = await ItemsModel.findByPk(deCryptFakeId(id));
    if (!item) {
      throw new RestError('item not available', 404);
    }
    item.nameItem = nameItem ?? item.nameItem;
    item.itemThumb = itemThumb ?? item.itemThumb;
    item.description = description ?? item.description;
    item.brandName = brandName ?? item.brandName;
    item.origin = origin ?? item.origin;
    item.prices = prices ?? item.prices;
    item.quantityStock = quantityStock ?? item.quantityStock;
    await item.save({ transaction: transactionDB });
    const EntityAttsModel = await this.mapItemsServices.getType(item.typeProduct as ItemsType);
    const entityId = deCryptFakeId(payloadEntity.id);
    delete payloadEntity.id;
    delete payloadEntity.entityId;
    await EntityAttsModel.update(payloadEntity, { where: { id: entityId }, transaction: transactionDB });
    return this.transformModelToEntity(item);
  }

  async updatedSliders(id: string, itemThumb: string[]): Promise<void> {
    await ItemsModel.update({ itemThumb }, { where: { id: deCryptFakeId(id) } });
    return;
  }

  async deletedItems(id: string, transactionDB?: Transaction): Promise<void> {
    const item = await ItemsModel.findByPk(deCryptFakeId(id));
    if (!item) {
      throw new RestError('item not available', 404);
    }
    await item.destroy({ transaction: transactionDB });
    const entiry = await EntityValuesModel.findOne({ where: { itemId: item.id } });
    if (!entiry) {
      throw new RestError('item not available', 404);
    }
    if (item.itemThumb && item.itemThumb.length) {
      item.itemThumb.forEach((item) => removeFile(item));
    }
    const EntityAttsModel = await this.mapItemsServices.getType(item.typeProduct as ItemsType);
    await EntityAttsModel.destroy({ where: { entityId: entiry.id }, transaction: transactionDB });
    return;
  }
  /**
   * Transforms database model into domain entity
   * @param model
   */
  private transformModelToEntity(model: ItemsModel): ItemsInterface {
    if (!model) return;
    const entity: ItemsInterface = {};
    const keysObj = Object.keys(model.dataValues);
    let keysEntity: any;
    if (model.dataValues.entityValues) {
      keysEntity = Object.keys(model.dataValues.entityValues.dataValues);
    }
    for (let key of keysObj) {
      if (key === 'entityValues' && keysEntity.length) {
        entity[key] = {};
        for (let keyE of keysEntity) {
          if (model[key][keyE] !== null) {
            if (keyE !== 'created_at' && keyE !== 'updated_at') {
              entity[key][keyE] = model[key][keyE];
            }
          }
        }
        if (Object.entries(entity[key]).length === 0) {
          delete entity[key];
        }
      } else if (key !== 'created_at' && key !== 'updated_at') {
        entity[key] = model[key];
      }
    }
    entity.id = enCryptFakeId(entity.id);
    entity.shopId = enCryptFakeId(entity.shopId);
    entity.productId = enCryptFakeId(entity.productId);
    if (entity.entityValues) {
      entity.entityValues.id = enCryptFakeId(entity.entityValues.id);
      entity.entityValues.itemId = enCryptFakeId(entity.entityValues.itemId);
      const { keyEntity, result } = parseEntityValues(entity.entityValues);
      entity.entityValues[keyEntity] = result;
    }
    return entity;
  }
}

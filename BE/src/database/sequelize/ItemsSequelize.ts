import { Transaction } from 'sequelize';
import { deCryptFakeId, enCryptFakeId } from '../../utils/fakeid';
import { IItemsRepository } from '../../repository/IItemsRepository';
import { PayloadEntity, ItemsInterface, ItemsType } from '../../interface/ItemsInterface';
import { ItemsModel } from '../model/ItemsModel';
import { MapItemsServices } from '../../services/EAV/MapItemsServices';
import { EntityValuesModel } from '../model/EAV/EntityValuesModel';
import { RestError } from '../../services/error/error';
import { EntityClothersModel } from '../model/EAV/EntityClothersModel';
import { EntityCosmesticsModel } from '../model/EAV/EntityCosmesticsModel';
import { EntityElectronicsModel } from '../model/EAV/EntityElectronicsModel';
import { EntityFunituresModel } from '../model/EAV/EntityFunituresModel';

export class ItemsSequelize implements IItemsRepository {
  private INCLUED = [{ model: EntityClothersModel }, { model: EntityCosmesticsModel }, { model: EntityElectronicsModel }, { model: EntityFunituresModel }];
  constructor(private mapItemsServices: MapItemsServices) {}

  async getListsItems(shopId: string): Promise<ItemsInterface[]> {
    const lists = await ItemsModel.findAll({
      where: { shopId: deCryptFakeId(shopId) },
      include: [{ model: EntityValuesModel, include: this.INCLUED }]
    });
    return lists.map((item) => this.transformModelToEntity(item));
  }

  async getItemsById(id: string): Promise<ItemsInterface> {
    const find = await ItemsModel.findByPk(deCryptFakeId(id), { include: [{ model: EntityValuesModel, include: this.INCLUED }] });
    return this.transformModelToEntity(find);
  }

  async createdItems(payload: ItemsInterface, payloadEntity: PayloadEntity, transactionDB?: Transaction): Promise<ItemsInterface> {
    const { shopId, productId, nameItem, itemThumb, description, brandName, origin, prices, typeProduct } = payload;
    const items = await ItemsModel.create({ shopId: deCryptFakeId(shopId), productId, nameItem, itemThumb, description, brandName, origin, typeProduct, prices }, { transaction: transactionDB });
    const entiyValues = await EntityValuesModel.create({ itemId: items.id }, { transaction: transactionDB });
    const EntityAttsModel = await this.mapItemsServices.getType(typeProduct as ItemsType);
    const payloadEntitys = { ...payloadEntity, entityId: entiyValues.id };
    await EntityAttsModel.create(payloadEntitys, { transaction: transactionDB });
    return this.transformModelToEntity(items);
  }

  async updatedItems(payload: ItemsInterface, payloadEntity: PayloadEntity, transactionDB?: Transaction): Promise<void> {
    const { id, nameItem, itemThumb, description, brandName, origin, prices } = payload;
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
    await item.save({ transaction: transactionDB });
    const entiyValues = await EntityValuesModel.findOne({ where: { id: item.id } });
    const EntityAttsModel = await this.mapItemsServices.getType(item.typeProduct as ItemsType);
    await EntityAttsModel.update({ payloadEntity }, { where: { entityId: entiyValues.id }, transaction: transactionDB });
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
    for (let key of keysObj) {
      entity[key] = model[key];
    }
    entity.id = enCryptFakeId(entity.id);
    entity.shopId = enCryptFakeId(entity.shopId);
    return entity;
  }
}

import { Model, ModelCtor } from 'sequelize';
import { ItemsType, MapItemsType } from '../../interface/ItemsInterface';
import { RestError } from '../error/error';

export class MapItemsServices {
  private mapServices: Map<string, any>;

  constructor() {
    this.setType();
  }

  public setType() {
    this.mapServices = new Map();
    for (let item of MapItemsType) {
      this.mapServices.set(item.key, item.value);
    }
  }

  public async getType(type: ItemsType): Promise<ModelCtor<Model<any, any>>> {
    this.hasType(type);
    return await this.mapServices.get(type);
  }

  private hasType(type: ItemsType) {
    if (!this.mapServices.has(type)) {
      throw new RestError('Unsupported items', 404);
    }
  }
}

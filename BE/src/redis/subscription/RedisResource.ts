import { ShopsResourcesSequelize } from '../../database/sequelize/ShopsResourcesSequelize';
import { MainkeysRedis } from '../../interface/KeyRedisInterface';
import { ShopsResourcesInterface } from '../../interface/ShopsResourcesInterface';
import { IShopsResourcesRepository } from '../../repository/IShopsResourcesRepository';
import { redisController } from '../RedisController';

export class RedisResource {
  private shopsResourcesRepository: IShopsResourcesRepository = new ShopsResourcesSequelize();
  static instance: RedisResource;

  private constructor() {}

  public static getInstance(): RedisResource {
    if (!RedisResource.instance) {
      RedisResource.instance = new RedisResource();
    }
    return RedisResource.instance;
  }

  public async findByShopId(shopId: string): Promise<ShopsResourcesInterface> {
    let shopResourceRedis = await redisController.getRedis(`${MainkeysRedis.SHOP_RESOURCE_SHOPID}${shopId}`);
    if (!shopResourceRedis) {
      const shopResource = await this.shopsResourcesRepository.findByShopId(shopId);
      if (!shopResource) return;
      shopResourceRedis = await redisController.setRedis({ keyValue: `${MainkeysRedis.SHOP_RESOURCE_SHOPID}${shopId}`, value: shopResource });
    }
    return shopResourceRedis;
  }

  public async findById(id: string): Promise<ShopsResourcesInterface> {
    let shopResourceRedis = await redisController.getRedis(`${MainkeysRedis.SHOP_RESOURCE_ID}${id}`);
    if (!shopResourceRedis) {
      const shopResource = await this.shopsResourcesRepository.findById(id);
      if (!shopResource) return;
      shopResourceRedis = await redisController.setRedis({ keyValue: `${MainkeysRedis.SHOP_RESOURCE_ID}${id}`, value: shopResource });
    }
    return shopResourceRedis;
  }

  public async handlerUpdateKeys(mainKeys: string, id: string, shopResource: ShopsResourcesInterface): Promise<void> {
    await redisController.setRedis({ keyValue: `${mainKeys}${id}`, value: shopResource });
  }

  public async handlerDelKeys(mainKeys: string, id: string): Promise<void> {
    await redisController.delRedis(`${mainKeys}${id}`);
  }
}

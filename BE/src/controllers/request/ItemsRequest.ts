import { EntityClothesIntersface, EntityCosmeticsInterface, EntityElectronicsInterface, EntityFunituresInterface, ItemsInterface, ItemsType, PayloadEntity } from '../../interface/ItemsInterface';
import { SubscriptionStatus } from '../../interface/SubscriptionInterface';
import { RedisProducts } from '../../redis/products/RedisProducts';
import { RedisResource } from '../../redis/subscription/RedisResource';
import { RedisSubscription } from '../../redis/subscription/RedisSubscription';
import { RedisUsers } from '../../redis/users/RedisUsers';
import { RestError } from '../../services/error/error';
import { TypeOfValue, isCheckedTypeValues } from '../../utils/validate';

export class ItemRequest {
  private redisProducts: RedisProducts = new RedisProducts();
  public items: ItemsInterface;
  public payloadEntity: PayloadEntity;

  async validateObject(userId: string, items: ItemsInterface, payloadEntity: PayloadEntity, typeCheck: boolean): Promise<[ItemsInterface, PayloadEntity]> {
    if (!isCheckedTypeValues(items, TypeOfValue.OBJECT) || !isCheckedTypeValues(payloadEntity, TypeOfValue.OBJECT)) {
      throw new RestError('payload not available', 404);
    }
    const { id, shopId, productId, nameItem, itemThumb, description, prices, quantityStock, brandName, origin } = items;
    if (id && !isCheckedTypeValues(id, TypeOfValue.STRING)) {
      throw new RestError('Payload not available', 404);
    }

    if (!isCheckedTypeValues(shopId, TypeOfValue.STRING)) {
      throw new RestError('Shop not available', 404);
    }

    if (!isCheckedTypeValues(productId, TypeOfValue.STRING)) {
      throw new RestError('Product not available', 404);
    }

    if (payloadEntity.id && !isCheckedTypeValues(payloadEntity.id, TypeOfValue.STRING)) {
      throw new RestError('item not available 1', 404);
    }

    if (payloadEntity.entityId && !isCheckedTypeValues(payloadEntity.entityId, TypeOfValue.STRING)) {
      throw new RestError('item not available', 404);
    }

    if (nameItem && !isCheckedTypeValues(nameItem, TypeOfValue.STRING)) {
      throw new RestError('Name not Empty', 404);
    }

    if (itemThumb && !isCheckedTypeValues(itemThumb, TypeOfValue.ARRAY, false)) {
      throw new RestError('Images thumb not Empty', 404);
    }

    if (description && !isCheckedTypeValues(description, TypeOfValue.STRING)) {
      throw new RestError('Description not Empty', 404);
    }

    if (prices && !isCheckedTypeValues(prices, TypeOfValue.NUMBER)) {
      throw new RestError('Prices not Empty', 404);
    }

    if (prices && prices > 10000) {
      throw new RestError('Prices not available', 404);
    }

    if (quantityStock && !isCheckedTypeValues(quantityStock, TypeOfValue.NUMBER)) {
      throw new RestError('Number sotck not Empty', 404);
    }

    if (quantityStock && quantityStock > 10000) {
      throw new RestError('Number sotck not available', 404);
    }

    if (brandName && !isCheckedTypeValues(brandName, TypeOfValue.STRING)) {
      throw new RestError('Brand Name not available', 404);
    }

    if (origin && !isCheckedTypeValues(origin, TypeOfValue.STRING)) {
      throw new RestError('Origin Name not available', 404);
    }
    const shops = await RedisUsers.getInstance().handlerGetShopId(shopId, userId);
    if (!shops || shops.userId !== userId) {
      throw new RestError('shop is not available', 404);
    }
    const subs = await RedisSubscription.getInstance().getSubsByShopId(shopId);
    if (!subs || subs.status !== SubscriptionStatus.ACTIVE) {
      throw new RestError('shop is not subscription', 404);
    }
    if (typeCheck) {
      const shopResource = await RedisResource.getInstance().findByShopId(shopId);
      if (!shopResource) {
        throw new RestError('shop is not subscription', 404);
      }
      if (shopResource.numberItem <= 0) {
        throw new RestError('Item is zero, please upgrade subscription or waiting next payment!', 404);
      }
    }
    const isCheckProduct = shops.prodcutSell.find((item) => item.id === productId);
    if (!isCheckProduct) {
      throw new RestError('Product not registed', 404);
    }
    const findProduct = await this.redisProducts.handlerGetProductsId(productId);
    if (!findProduct) {
      throw new RestError('Product not available', 404);
    }
    const typeProduct = findProduct.nameProduct.toUpperCase();

    switch (typeProduct) {
      case ItemsType.ELECTRONICS:
        this.validateAttbsElectronic(payloadEntity);
        break;
      case ItemsType.CLOTHES:
        this.validateAttbsClothers(payloadEntity);
        break;
      case ItemsType.COSMETICS:
        this.validateAttbsCosmetics(payloadEntity);
        break;
      case ItemsType.FUNITURES:
        this.validateAttbsFunitures(payloadEntity);
        break;

      default:
        break;
    }

    this.items = { ...items, typeProduct, subscriptionId: subs.subscriptionId };
    this.payloadEntity = payloadEntity;

    return [this.items, this.payloadEntity];
  }

  protected validateAttbsElectronic(payloadEntity: PayloadEntity) {
    const { color, storage, screenSize, weight, technology, warranty } = payloadEntity as EntityElectronicsInterface;

    if (color && !isCheckedTypeValues(color, TypeOfValue.STRING)) {
      throw new RestError('Color not available', 404);
    }

    if (storage && !isCheckedTypeValues(storage, TypeOfValue.STRING)) {
      throw new RestError('Storage not available', 404);
    }

    if (screenSize && !isCheckedTypeValues(screenSize, TypeOfValue.STRING)) {
      throw new RestError('Screen size not available', 404);
    }

    if (weight && !isCheckedTypeValues(weight, TypeOfValue.STRING)) {
      throw new RestError('Weight not available', 404);
    }

    if (technology && !isCheckedTypeValues(technology, TypeOfValue.STRING)) {
      throw new RestError('Technology not available', 404);
    }

    if (warranty && !isCheckedTypeValues(warranty, TypeOfValue.BOOLEAN)) {
      throw new RestError('Warranty not empty', 404);
    }
  }

  protected validateAttbsClothers(payloadEntity: PayloadEntity) {
    const { color, material, size, styleList } = payloadEntity as EntityClothesIntersface;

    if (color && !isCheckedTypeValues(color, TypeOfValue.STRING)) {
      throw new RestError('Color not available', 404);
    }

    if (material && !isCheckedTypeValues(material, TypeOfValue.STRING)) {
      throw new RestError('Material not available', 404);
    }

    if (size && !isCheckedTypeValues(size, TypeOfValue.STRING)) {
      throw new RestError('Size not available', 404);
    }

    if (styleList && !isCheckedTypeValues(styleList, TypeOfValue.STRING)) {
      throw new RestError('Style list not available', 404);
    }
  }

  protected validateAttbsCosmetics(payloadEntity: PayloadEntity) {
    const { volume, weight, activesIngredients, expiry } = payloadEntity as EntityCosmeticsInterface;

    if (volume && !isCheckedTypeValues(volume, TypeOfValue.STRING)) {
      throw new RestError('Volume not available', 404);
    }

    if (weight && !isCheckedTypeValues(weight, TypeOfValue.STRING)) {
      throw new RestError('Weight not available', 404);
    }

    if (activesIngredients && !isCheckedTypeValues(activesIngredients, TypeOfValue.STRING)) {
      throw new RestError('Actives ingredients not available', 404);
    }

    if (expiry && !isCheckedTypeValues(expiry, TypeOfValue.STRING)) {
      throw new RestError('Expiry list not available', 404);
    }
  }

  protected validateAttbsFunitures(payloadEntity: PayloadEntity) {
    const { size, material, manufactury, funtion, warranty } = payloadEntity as EntityFunituresInterface;

    if (size && !isCheckedTypeValues(size, TypeOfValue.STRING)) {
      throw new RestError('Size not available', 404);
    }

    if (material && !isCheckedTypeValues(material, TypeOfValue.STRING)) {
      throw new RestError('Material not available', 404);
    }

    if (manufactury && !isCheckedTypeValues(manufactury, TypeOfValue.STRING)) {
      throw new RestError('Manufactury not available', 404);
    }

    if (funtion && !isCheckedTypeValues(funtion, TypeOfValue.STRING)) {
      throw new RestError('Funtion not available', 404);
    }

    if (warranty && !isCheckedTypeValues(warranty, TypeOfValue.BOOLEAN)) {
      throw new RestError('Warranty not available', 404);
    }
  }
}

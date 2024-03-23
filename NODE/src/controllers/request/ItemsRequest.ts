import { Messages, handleMsgEmptyWithField, handleMsgNotAvalidWithField } from '../../common/messages';
import { ProductsSequelize } from '../../database/sequelize/ProductsSequelize';
import { ShopSequelize } from '../../database/sequelize/ShopSequelize';
import { ShopsResourcesSequelize } from '../../database/sequelize/ShopsResourcesSequelize';
import { SubscriptionSequelize } from '../../database/sequelize/SubscriptionSequelize';
import { EntityClothesIntersface, EntityCosmeticsInterface, EntityElectronicsInterface, EntityFunituresInterface, ItemsInterface, ItemsType, PayloadEntity } from '../../interface/ItemsInterface';
import { SubscriptionStatus } from '../../interface/SubscriptionInterface';
import { RestError } from '../../services/error/error';
import { TypeOfValue, isCheckedTypeValues } from '../../utils/validate';

export class ItemRequest {
  private productsRepository: ProductsSequelize = new ProductsSequelize();
  private subscriptionRepository: SubscriptionSequelize = new SubscriptionSequelize();
  private shopsResourcesRepository: ShopsResourcesSequelize = new ShopsResourcesSequelize();
  private shopRepository: ShopSequelize = new ShopSequelize();
  public items: ItemsInterface;
  public payloadEntity: PayloadEntity;

  async validateObject(userId: string, items: ItemsInterface, payloadEntity: PayloadEntity, typeCheck: boolean): Promise<[ItemsInterface, PayloadEntity]> {
    if (!isCheckedTypeValues(items, TypeOfValue.OBJECT) || !isCheckedTypeValues(payloadEntity, TypeOfValue.OBJECT)) {
      throw new RestError(Messages.PAYLOAD_AVAILABLE, 404);
    }
    const { id, shopId, productId, nameItem, itemThumb, description, prices, quantityStock, brandName, origin } = items;
    if (id && !isCheckedTypeValues(id, TypeOfValue.STRING)) {
      throw new RestError(Messages.PAYLOAD_AVAILABLE, 404);
    }

    if (!isCheckedTypeValues(shopId, TypeOfValue.STRING)) {
      throw new RestError(Messages.NOT_AVAILABLE, 404);
    }

    if (!isCheckedTypeValues(productId, TypeOfValue.STRING)) {
      throw new RestError(Messages.NOT_AVAILABLE, 404);
    }

    if (payloadEntity.id && !isCheckedTypeValues(payloadEntity.id, TypeOfValue.STRING)) {
      throw new RestError(Messages.NOT_AVAILABLE, 404);
    }

    if (payloadEntity.entityId && !isCheckedTypeValues(payloadEntity.entityId, TypeOfValue.STRING)) {
      throw new RestError(Messages.NOT_AVAILABLE, 404);
    }

    if (nameItem && !isCheckedTypeValues(nameItem, TypeOfValue.STRING)) {
      throw new RestError(handleMsgEmptyWithField('name item'), 404);
    }

    if (itemThumb && !isCheckedTypeValues(itemThumb, TypeOfValue.ARRAY, false)) {
      throw new RestError(handleMsgEmptyWithField('Images thumb'), 404);
    }

    if (description && !isCheckedTypeValues(description, TypeOfValue.STRING)) {
      throw new RestError(handleMsgEmptyWithField('Description'), 404);
    }

    if (prices && !isCheckedTypeValues(prices, TypeOfValue.NUMBER)) {
      throw new RestError(handleMsgEmptyWithField('Prices'), 404);
    }

    if (prices && prices > 10000) {
      throw new RestError(handleMsgNotAvalidWithField('Prices'), 404);
    }

    if (quantityStock && !isCheckedTypeValues(quantityStock, TypeOfValue.NUMBER)) {
      throw new RestError(handleMsgEmptyWithField('Number sotck'), 404);
    }

    if (quantityStock && quantityStock > 10000) {
      throw new RestError(Messages.NOT_AVAILABLE, 404);
    }

    if (brandName && !isCheckedTypeValues(brandName, TypeOfValue.STRING)) {
      throw new RestError(handleMsgNotAvalidWithField('Brand Name'), 404);
    }

    if (origin && !isCheckedTypeValues(origin, TypeOfValue.STRING)) {
      throw new RestError(handleMsgNotAvalidWithField('Origin Name'), 404);
    }
    const shops = await this.shopRepository.getShopById(shopId, userId);
    if (!shops || shops.userId !== userId) {
      throw new RestError(handleMsgNotAvalidWithField('Shop'), 404);
    }
    const subs = await this.subscriptionRepository.findByShopId(shopId);
    if (!subs || subs.status !== SubscriptionStatus.ACTIVE) {
      throw new RestError(Messages.SHOP_NONE_SUBS, 404);
    }
    if (typeCheck) {
      const shopResource = await this.shopsResourcesRepository.findByShopId(shopId);
      if (!shopResource) {
        throw new RestError(Messages.SHOP_NONE_SUBS, 404);
      }
      if (shopResource.numberItem <= 0) {
        throw new RestError(Messages.ITEM_RESOURCE_END, 404);
      }
    }
    const isCheckProduct = shops.products.find((item) => item.id === productId);
    if (!isCheckProduct) {
      throw new RestError(Messages.PROD_NONE_REG, 404);
    }
    const findProduct = await this.productsRepository.getProductById(productId);
    if (!findProduct) {
      throw new RestError(handleMsgNotAvalidWithField('Product'), 404);
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
      throw new RestError(handleMsgNotAvalidWithField('Color'), 404);
    }

    if (storage && !isCheckedTypeValues(storage, TypeOfValue.STRING)) {
      throw new RestError(handleMsgNotAvalidWithField('Storage'), 404);
    }

    if (screenSize && !isCheckedTypeValues(screenSize, TypeOfValue.STRING)) {
      throw new RestError(handleMsgNotAvalidWithField('Screen'), 404);
    }

    if (weight && !isCheckedTypeValues(weight, TypeOfValue.STRING)) {
      throw new RestError(handleMsgNotAvalidWithField('Weight'), 404);
    }

    if (technology && !isCheckedTypeValues(technology, TypeOfValue.STRING)) {
      throw new RestError(handleMsgNotAvalidWithField('Technology'), 404);
    }

    if (warranty && !isCheckedTypeValues(warranty, TypeOfValue.BOOLEAN)) {
      throw new RestError(handleMsgNotAvalidWithField('Warranty'), 404);
    }
  }

  protected validateAttbsClothers(payloadEntity: PayloadEntity) {
    const { color, material, size, styleList } = payloadEntity as EntityClothesIntersface;

    if (color && !isCheckedTypeValues(color, TypeOfValue.STRING)) {
      throw new RestError(handleMsgNotAvalidWithField('Color'), 404);
    }

    if (material && !isCheckedTypeValues(material, TypeOfValue.STRING)) {
      throw new RestError(handleMsgNotAvalidWithField('Material'), 404);
    }

    if (size && !isCheckedTypeValues(size, TypeOfValue.STRING)) {
      throw new RestError(handleMsgNotAvalidWithField('Size'), 404);
    }

    if (styleList && !isCheckedTypeValues(styleList, TypeOfValue.STRING)) {
      throw new RestError(handleMsgNotAvalidWithField('Style'), 404);
    }
  }

  protected validateAttbsCosmetics(payloadEntity: PayloadEntity) {
    const { volume, weight, activesIngredients, expiry } = payloadEntity as EntityCosmeticsInterface;

    if (volume && !isCheckedTypeValues(volume, TypeOfValue.STRING)) {
      throw new RestError(handleMsgNotAvalidWithField('Volume'), 404);
    }

    if (weight && !isCheckedTypeValues(weight, TypeOfValue.STRING)) {
      throw new RestError(handleMsgNotAvalidWithField('Weight'), 404);
    }

    if (activesIngredients && !isCheckedTypeValues(activesIngredients, TypeOfValue.STRING)) {
      throw new RestError(handleMsgNotAvalidWithField('Actives'), 404);
    }

    if (expiry && !isCheckedTypeValues(expiry, TypeOfValue.STRING)) {
      throw new RestError(handleMsgNotAvalidWithField('Expiry'), 404);
    }
  }

  protected validateAttbsFunitures(payloadEntity: PayloadEntity) {
    const { size, material, manufactury, funtion, warranty } = payloadEntity as EntityFunituresInterface;

    if (size && !isCheckedTypeValues(size, TypeOfValue.STRING)) {
      throw new RestError(handleMsgNotAvalidWithField('Size'), 404);
    }

    if (material && !isCheckedTypeValues(material, TypeOfValue.STRING)) {
      throw new RestError(handleMsgNotAvalidWithField('Material'), 404);
    }

    if (manufactury && !isCheckedTypeValues(manufactury, TypeOfValue.STRING)) {
      throw new RestError(handleMsgNotAvalidWithField('Manufactury'), 404);
    }

    if (funtion && !isCheckedTypeValues(funtion, TypeOfValue.STRING)) {
      throw new RestError(handleMsgNotAvalidWithField('Funtion'), 404);
    }

    if (warranty && !isCheckedTypeValues(warranty, TypeOfValue.BOOLEAN)) {
      throw new RestError(handleMsgNotAvalidWithField('Warranty'), 404);
    }
  }
}

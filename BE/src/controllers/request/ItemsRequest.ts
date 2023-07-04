import { ItemsInterface, PayloadEntity } from '../../interface/ItemsInterface';
import { RestError } from '../../services/error/error';
import { TypeOfValue, isCheckedTypeValues } from '../../utils/validate';
import { Request } from 'express';

export class ItemRequest {
  public items: ItemsInterface;
  public payloadEntity: PayloadEntity;
  constructor(request: Request) {
    const { items, payloadEntity } = request.body;
    this.validateObject(items, payloadEntity);
  }

  protected validateObject(items: ItemsInterface, payloadEntity: PayloadEntity) {
    if (!isCheckedTypeValues(items, TypeOfValue.OBJECT) || !isCheckedTypeValues(payloadEntity, TypeOfValue.OBJECT)) {
      throw new RestError('payload not available', 404);
    }
    const { id, productId, nameItem, itemThumb, description, brandName, origin, prices } = items;
    if (
      (id && !isCheckedTypeValues(id, TypeOfValue.STRING)) ||
      !isCheckedTypeValues(productId, TypeOfValue.STRING) ||
      !isCheckedTypeValues(nameItem, TypeOfValue.STRING) ||
      (itemThumb && !isCheckedTypeValues(itemThumb, TypeOfValue.ARRAY)) ||
      !isCheckedTypeValues(description, TypeOfValue.STRING) ||
      !isCheckedTypeValues(brandName, TypeOfValue.STRING) ||
      !isCheckedTypeValues(origin, TypeOfValue.STRING) ||
      !isCheckedTypeValues(prices, TypeOfValue.NUMBER)
    ) {
      throw new RestError('payload not available', 404);
    }
    this.items = items;
    this.payloadEntity = payloadEntity;
  }
}

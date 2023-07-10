import { ItemsInterface, ListItemsInterface } from '../interface/ItemsInterface';
import { ProductsInterface } from '../interface/ProductsInterface';

export class GuestUseCase {
  constructor() {}

  public compareProductWithItems(products: ProductsInterface[], items: ItemsInterface[]) {
    return products.map((prod) => ({ ...prod, items: items.filter((item) => item.productId === prod.id) }));
  }
}

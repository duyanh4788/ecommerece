export interface ListItemsInterface {
  total?: number;
  currentPage?: number;
  nextPage?: number;
  pageSize?: number;
  typeSaga?: string;
  items?: ItemsInterface[];
}

export interface ValuesItems
  extends ItemsInterface,
    EntityElectronicsInterface,
    EntityClothesIntersface,
    EntityCosmeticsInterface,
    EntityFunituresInterface {}

export interface ItemsInterface {
  id?: string | number | any;
  shopId?: string | number | any;
  productId?: string | number | any;
  nameItem?: string;
  itemThumb?: string[];
  description?: string;
  brandName?: string;
  origin?: string;
  prices?: number;
  quantityStock?: number;
  quantitySold?: number;
  status?: boolean;
  typeProduct?: string;
  createdAt?: Date;
  entityValues?: EntityValuesInterface;
  isAdd?: boolean;
}

export interface EntityValuesInterface {
  id?: string | number | any;
  itemId?: string | number | any;
  createdAt?: Date;
  entityElectronics?: EntityElectronicsInterface;
  entityClothers?: EntityClothesIntersface;
  entityCosmestics?: EntityCosmeticsInterface;
  entityFunitures?: EntityFunituresInterface;
  attributes?: PayloadEntity;
}

export interface EntityCosmeticsInterface {
  id?: string | number | any;
  entityId?: string | number | any;
  volume?: string;
  weight?: string;
  activesIngredients?: string;
  expiry?: string;
  createdAt?: Date;
}

export interface EntityFunituresInterface {
  id?: string | number | any;
  entityId?: string | number | any;
  size?: string;
  material?: string;
  warranty?: boolean;
  manufactury?: string;
  funtion?: string;
  createdAt?: Date;
}

export interface EntityElectronicsInterface {
  id?: string | number | any;
  entityId?: string | number | any;
  color?: string;
  storage?: string;
  screenSize?: string;
  weight?: string;
  technology?: string;
  warranty?: boolean;
  createdAt?: Date;
}

export interface EntityClothesIntersface {
  id?: string | number | any;
  entityId?: string | number | any;
  color?: string;
  material?: string;
  size?: string;
  styleList?: string;
  createdAt?: Date;
}

export enum ItemsType {
  CLOTHES = 'CLOTHES',
  COSMETICS = 'COSMETICS',
  ELECTRONICS = 'ELECTRONICS',
  FUNITURES = 'FUNITURES',
}

export enum TypeSaga {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
}

export interface PayloadItems {
  items: ItemsInterface;
  payloadEntity: PayloadEntity;
}

export type PayloadEntity =
  | EntityClothesIntersface
  | EntityCosmeticsInterface
  | EntityFunituresInterface
  | EntityElectronicsInterface;

export const formInputItem = [
  { key: 1, name: 'nameItem', type: 'text', placeholder: 'Name Item' },
  { key: 2, name: 'prices', type: 'number', placeholder: 'Prices' },
  { key: 3, name: 'brandName', type: 'text', placeholder: 'Brand Name' },
  { key: 4, name: 'quantityStock', type: 'text', placeholder: 'Number Stock' },
  { key: 5, name: 'origin', type: 'text', placeholder: 'Origin' },
];

export const formInputClosthers = [
  { key: 1, name: 'color', type: 'text', placeholder: 'Color' },
  { key: 2, name: 'material', type: 'text', placeholder: 'Material' },
  { key: 3, name: 'size', type: 'text', placeholder: 'Size' },
  { key: 4, name: 'styleList', type: 'text', placeholder: 'Style List' },
];

export const formInputFunitures = [
  { key: 1, name: 'size', type: 'text', placeholder: 'Size' },
  { key: 2, name: 'material', type: 'text', placeholder: 'Material' },
  { key: 3, name: 'manufactury', type: 'text', placeholder: 'Manufactury' },
  { key: 4, name: 'funtion', type: 'text', placeholder: 'Function' },
];

export const formInputElectronics = [
  { key: 1, name: 'color', type: 'text', placeholder: 'Color' },
  { key: 2, name: 'storage', type: 'text', placeholder: 'Storage' },
  { key: 3, name: 'screenSize', type: 'text', placeholder: 'Screen Size' },
  { key: 4, name: 'weight', type: 'text', placeholder: 'Weight' },
  { key: 5, name: 'technology', type: 'text', placeholder: 'Technology' },
];

export const formInputCosmetics = [
  { key: 1, name: 'volume', type: 'text', placeholder: 'Volume' },
  { key: 2, name: 'weight', type: 'text', placeholder: 'Weight' },
  { key: 3, name: 'activesIngredients', type: 'text', placeholder: 'Actives Ingredients' },
  { key: 4, name: 'expiry', type: 'text', placeholder: 'Expiry Month' },
];

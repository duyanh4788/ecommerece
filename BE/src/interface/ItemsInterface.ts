import { EntityClothersModel } from '../database/model/EAV/EntityClothersModel';
import { EntityCosmesticsModel } from '../database/model/EAV/EntityCosmesticsModel';
import { EntityElectronicsModel } from '../database/model/EAV/EntityElectronicsModel';
import { EntityFunituresModel } from '../database/model/EAV/EntityFunituresModel';

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
}

export interface EntityValuesInterface {
  id?: string | number | any;
  itemId?: string | number | any;
  createdAt?: Date;
  attributes?: EntityCosmeticsInterface | EntityFunituresInterface | EntityElectronicsInterface | EntityClothesIntersface;
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
  expiry?: string;
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
  CLOTHERS = 'CLOTHERS',
  COSMETICS = 'COSMETICS',
  ELECTRONICS = 'ELECTRONICS',
  FUNITURES = 'FUNITURES'
}

export const MapItemsType = [
  { key: 'CLOTHERS', value: EntityClothersModel },
  { key: 'COSMETICS', value: EntityCosmesticsModel },
  { key: 'ELECTRONICS', value: EntityElectronicsModel },
  { key: 'FUNITURES', value: EntityFunituresModel }
];

export type PayloadEntity = EntityClothersModel | EntityCosmeticsInterface | EntityFunituresInterface | EntityElectronicsInterface;

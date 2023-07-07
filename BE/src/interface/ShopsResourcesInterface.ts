export interface ShopsResourcesInterface {
  id?: string | number | any;
  shopId?: string | number | any;
  userId?: string | number | any;
  numberProduct?: number;
  numberItem?: number;
  createdAt?: Date;
}

export enum TypeDecInc {
  NUMBER_PRODUCT = 'numberProduct',
  NUMBER_ITEM = 'numberItem'
}

export enum IntegerValue {
  DECR = 'decrement',
  INCR = 'increment'
}

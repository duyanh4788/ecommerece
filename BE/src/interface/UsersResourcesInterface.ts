export interface UsersResourcesInterface {
  id?: string | number | any;
  userId?: string | number | any;
  numberProduct?: number;
  numberItem?: number;
  createdAt?: Date;
}

export enum TypeDecInc {
  NUMBER_PRODUCT = 'numberProduct',
  NUMBER_INDEX = 'numberItem'
}

export enum IntegerValue {
  DECR = 'decrement',
  INCR = 'increment'
}

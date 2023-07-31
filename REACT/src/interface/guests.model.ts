import { ItemsInterface } from './Items.mode';

export interface ProductsInterface {
  id?: string | number | any;
  nameProduct?: string;
  avatar?: string;
  status?: boolean;
  createdAt?: Date;
  items?: ItemsInterface[];
  nextPage?: number;
  pageSize?: number;
  currentPage?: number;
  total?: number;
}

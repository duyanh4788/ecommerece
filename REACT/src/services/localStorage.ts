import { Users } from 'interface/Users.model';

export enum TypeLocal {
  GET = 'GET',
  SET = 'SET',
  CLEAR = 'CLEAR',
  REMOVE = 'REMOVE',
}

export interface TierLocal {
  tier: string;
  type: string;
  amout: string;
  isTrial: boolean;
}

export type LocalStorageItem = {
  key: string;
  value: Users | TierLocal | any;
};

export enum LocalStorageKey {
  user = '_user',
  shopId = '_shopId',
  tier = '_tier',
  tabs = '_tabs',
  socket_user = '_socket_user',
  socket_shop = '_socket_shop',
}

export class LocalStorageService {
  public setItem({ key, value }: LocalStorageItem): LocalStorageService {
    localStorage.setItem(key, JSON.stringify(value));
    return this;
  }

  public getItem(key: string): Users | TierLocal | null {
    const value = localStorage.getItem(key);
    if (value === null || value === 'undefined') return null;
    return JSON.parse(value);
  }

  public clearLocalStorage() {
    localStorage.clear();
  }

  public removeLocalStorageByKey(key: string) {
    localStorage.removeItem(key);
  }
}

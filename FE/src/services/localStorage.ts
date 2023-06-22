import { Users } from 'interface/Users.model';

export type LocalStorageItem = {
  key: string;
  value: Users;
};

export enum LocalStorageKey {
  user = '_user',
}

export class LocalStorageService {
  public setItem({ key, value }: LocalStorageItem): LocalStorageService {
    localStorage.setItem(key, JSON.stringify(value));
    return this;
  }

  public getItem(key: string): Users | null {
    const value = localStorage.getItem(key);
    if (value === null || value === 'undefined') return null;
    return JSON.parse(value);
  }

  public clearLocalStorage() {
    localStorage.clear();
  }
}

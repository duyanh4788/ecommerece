import { Users } from 'interface/Users.model';

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
  tier = '_tier',
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

  public getTier(key: string): TierLocal | null {
    const value = localStorage.getItem(key);
    if (value === null || value === 'undefined') return null;
    return JSON.parse(value);
  }

  public clearTier(): void {
    return localStorage.removeItem(LocalStorageKey.tier);
  }

  public clearLocalStorage() {
    localStorage.clear();
  }
}

import { Users } from 'interface/Users.model';
import { LocalStorageService, TierLocal, TypeLocal } from 'services/localStorage';

const local = new LocalStorageService();

export const localStorage = (type: string, key?: any, value?: any): Users | TierLocal | any => {
  switch (type) {
    case TypeLocal.GET:
      return local.getItem(key);
    case TypeLocal.SET:
      local.setItem({ key, value });
      break;
    case TypeLocal.REMOVE:
      local.removeLocalStorageByKey(key);
      break;
    case TypeLocal.CLEAR:
      local.clearLocalStorage();
      break;
    default:
      break;
  }
};

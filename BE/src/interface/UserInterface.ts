export enum UserRole {
  ADMIN = 'RL00001',
  OWNER_SHOP = 'RL00002',
  USER = 'RL00003'
}

export interface UserAttributes {
  id?: string | number | any | any;
  fullName?: string;
  email?: string;
  password?: string;
  avatar?: string;
  roleId: UserRole;
  phone?: string;
  activate?: boolean;
  createdAt?: Date;
}

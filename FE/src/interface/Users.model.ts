export interface Users {
  id?: string;
  fullName?: string;
  email?: string;
  password?: string;
  avatar?: string;
  roleId?: UserRole;
  phone?: string;
  activate?: boolean;
  createdAt?: Date;
  showPassword?: boolean;
  token?: string;
  refreshToKen?: string;
  expired?: number;
}

export enum UserRole {
  ADMIN = 'RL00001',
  OWNER_SHOP = 'RL00002',
  USER = 'RL00003',
}

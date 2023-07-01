import * as JWT from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { UserAttributes } from '../interface/UserInterface';
import { TokenUserInterface } from '../interface/TokenUserInterface';

enum EXPIRED_TOKEN {
  TOKEN = 86400 * 1000
}

export const encryptTokenPasswordOutput = (user: UserAttributes, keyStores: TokenUserInterface, refreshToKen?: string) => {
  const header = {
    userId: user.id,
    fullName: user.fullName,
    roleId: user.roleId,
    expired: new Date().getTime() + EXPIRED_TOKEN.TOKEN
  };
  const { privateKey, publicKey } = keyStores;
  const token = JWT.sign(header, publicKey, { expiresIn: '1d' }); // 1 day
  if (!refreshToKen) {
    const refreshToKenParse = JWT.sign(header, privateKey, { expiresIn: '90d' }); // 3 months
    return {
      ...header,
      token,
      refreshToKen: refreshToKenParse
    };
  }
  return {
    ...header,
    token,
    refreshToKen
  };
};

export const decryptTokenPasswordOutput = (token: string, keyTokenUser: string) => {
  return JWT.verify(token, keyTokenUser);
};

export const hashTokenPasswordInput = (passWord: string) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(passWord, salt);
};

export const compareSyncPasswordInput = (password: string, userPassword: string) => {
  return bcrypt.compareSync(password, userPassword);
};

export const genarateKeyPairSync = () => {
  const publicKey = crypto.randomBytes(32).toString('hex');
  const privateKey = crypto.randomBytes(32).toString('hex');
  return { publicKey, privateKey };
};

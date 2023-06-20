import * as JWT from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { UserAttributes } from '../interface/UserInterface';
import { TokenUserInterface } from '../interface/TokenUserInterface';

export const encryptTokenPasswordOutput = (user: UserAttributes, keyStores?: TokenUserInterface) => {
  const header = {
    userId: user.id,
    fullName: user.fullName,
    roleId: user.roleId
  };
  const { privateKey, publicKey } = keyStores;
  const token = JWT.sign(header, publicKey, { expiresIn: 604800 }); // 7 day
  const refreshToKen = JWT.sign(header, privateKey, { expiresIn: 604800 }); // 7 day
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

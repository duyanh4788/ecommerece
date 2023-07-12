export interface TokenUserInterface {
  id?: string | number | any;
  userId?: string | number | any;
  publicKey?: string;
  privateKey?: string;
  tokens?: string[];
  refreshTokens?: string[];
  refreshToken?: string;
  token?: string;
  createdAt?: Date;
}

export {};

declare global {
  namespace Express {
    interface Request {
      user?: any; // 👈️ turn off type checking
      tokenUser?: any; // 👈️ turn off type checking
      refreshToKen?: any; // 👈️ turn off type checking
      token?: any; // 👈️ turn off type checking
    }
  }

  var _pathFileImages: string;
  var _pathFileVideo: string;
  var _pathFileImgTest: string;
  var _pathProducts: string;
}

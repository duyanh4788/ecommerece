export {};

declare global {
  namespace Express {
    interface Request {
      user?: any; // 👈️ turn off type checking
    }
  }

  var _pathFileImages: string;
  var _pathFileVideo: string;
  var _pathFileImgTest: string;
}

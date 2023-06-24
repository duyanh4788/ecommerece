import { ProductsController } from '../controllers/ProductsController';
import { ShopController } from '../controllers/ShopController';
import { Uploadcontroller } from '../controllers/UploadController';
import { UsersController } from '../controllers/UserController';
import { AuthenticatesCodesSequelize } from '../database/sequelize/AuthenticatesCodesSequelize';
import { ProductsSequelize } from '../database/sequelize/ProductsSequelize';
import { ShopSequelize } from '../database/sequelize/ShopSequelize';
import { TokenUsersSequelize } from '../database/sequelize/TokenUsersSequelize';
import { UserSequelize } from '../database/sequelize/UsersSequelize';
import { AuthUserMiddleware } from '../middlewares/auth/AuthUserMiddleware';
import { VerifyTokenMiddleware } from '../middlewares/auth/VerifyTokenMiddleware';
import { MulterMiddleware } from '../middlewares/multer/MulterMiddleware';
import { ProductsUseCase } from '../usecase/ProductsUseCase';
import { ShopUseCase } from '../usecase/ShopUseCase';
import { UserUseCase } from '../usecase/UserUseCase';

export class MapServices {
  public authUserMiddleware: AuthUserMiddleware = new AuthUserMiddleware();
  public verifyTokenMiddleware: VerifyTokenMiddleware = new VerifyTokenMiddleware();
  public multerMiddleware: MulterMiddleware = new MulterMiddleware();
  public userSequelize: UserSequelize = new UserSequelize();
  public tokenUsersSequelize: TokenUsersSequelize = new TokenUsersSequelize();
  public authenticatesCodesSequelize: AuthenticatesCodesSequelize = new AuthenticatesCodesSequelize();
  public shopSequelize: ShopSequelize = new ShopSequelize();
  public productsSequelize: ProductsSequelize = new ProductsSequelize();

  public shopUseCase: ShopUseCase = new ShopUseCase(this.userSequelize, this.shopSequelize);
  public productsUseCase: ProductsUseCase = new ProductsUseCase(this.productsSequelize);
  public userUseCase: UserUseCase = new UserUseCase(this.userSequelize, this.tokenUsersSequelize, this.authenticatesCodesSequelize);
  public usersController: UsersController = new UsersController(this.userUseCase);
  public shopController: ShopController = new ShopController(this.shopUseCase);
  public productsController: ProductsController = new ProductsController(this.productsUseCase);
  public uploadcontroller: Uploadcontroller = new Uploadcontroller();
}

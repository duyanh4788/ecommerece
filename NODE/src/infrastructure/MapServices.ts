import { ItemsController } from '../controllers/ItemsController';
import { PaypalAppWebHookController } from '../controllers/PaypalAppWebHookController';
import { ProductsController } from '../controllers/ProductsController';
import { ShopController } from '../controllers/ShopController';
import { SubscriptionController } from '../controllers/SubscriptionController';
import { Uploadcontroller } from '../controllers/UploadController';
import { UsersController } from '../controllers/UserController';
import { AuthenticatesCodesSequelize } from '../database/sequelize/AuthenticatesCodesSequelize';
import { InvoicesSequelize } from '../database/sequelize/InvoicesSequelize';
import { ItemsSequelize } from '../database/sequelize/ItemsSequelize';
import { PaypalBillingPlanSequelize } from '../database/sequelize/PaypalBillingPlanSequelize';
import { ProductsSequelize } from '../database/sequelize/ProductsSequelize';
import { ShopSequelize } from '../database/sequelize/ShopSequelize';
import { SubscriptionSequelize } from '../database/sequelize/SubscriptionSequelize';
import { TokenUsersSequelize } from '../database/sequelize/TokenUsersSequelize';
import { ShopsResourcesSequelize } from '../database/sequelize/ShopsResourcesSequelize';
import { UserSequelize } from '../database/sequelize/UsersSequelize';
import { AuthUserMiddleware } from '../middlewares/auth/AuthUserMiddleware';
import { VerifyTokenMiddleware } from '../middlewares/auth/VerifyTokenMiddleware';
import { MulterMiddleware } from '../middlewares/multer/MulterMiddleware';
import { MapItemsServices } from '../services/EAV/MapItemsServices';
import { PaypalService } from '../services/paypal/PaypalService';
import { ItemsUseCase } from '../usecase/ItemsUseCase';
import { ProductsUseCase } from '../usecase/ProductsUseCase';
import { ShopUseCase } from '../usecase/ShopUseCase';
import { SubscriptionUseCase } from '../usecase/SubscriptionUseCase';
import { UserUseCase } from '../usecase/UserUseCase';
import { GuestController } from '../controllers/GuestController';
import { GuestUseCase } from '../usecase/GuestUseCase';
import { ShopProductsSequelize } from '../database/sequelize/ShopProductsSequelize';

export class MapServices {
  public paypalService: PaypalService = new PaypalService();
  public mapItemsServices: MapItemsServices = new MapItemsServices();

  public authUserMiddleware: AuthUserMiddleware = new AuthUserMiddleware();
  public verifyTokenMiddleware: VerifyTokenMiddleware = new VerifyTokenMiddleware();
  public multerMiddleware: MulterMiddleware = new MulterMiddleware();

  public userSequelize: UserSequelize = new UserSequelize();
  public tokenUsersSequelize: TokenUsersSequelize = new TokenUsersSequelize();
  public authenticatesCodesSequelize: AuthenticatesCodesSequelize = new AuthenticatesCodesSequelize();
  public shopSequelize: ShopSequelize = new ShopSequelize();
  public productsSequelize: ProductsSequelize = new ProductsSequelize();
  public shopProductsSequelize: ShopProductsSequelize = new ShopProductsSequelize();
  public paypalBillingPlanSequelize: PaypalBillingPlanSequelize = new PaypalBillingPlanSequelize();
  public invoicesSequelize: InvoicesSequelize = new InvoicesSequelize();
  public subscriptionSequelize: SubscriptionSequelize = new SubscriptionSequelize();
  public shopsResourcesSequelize: ShopsResourcesSequelize = new ShopsResourcesSequelize();
  public itemsSequelize: ItemsSequelize = new ItemsSequelize(this.mapItemsServices);

  public subscriptionUseCase: SubscriptionUseCase = new SubscriptionUseCase(
    this.paypalService,
    this.paypalBillingPlanSequelize,
    this.subscriptionSequelize,
    this.invoicesSequelize,
    this.shopsResourcesSequelize,
    this.shopSequelize,
    this.userSequelize
  );
  public guestUseCase: GuestUseCase = new GuestUseCase();
  public itemsUseCase: ItemsUseCase = new ItemsUseCase(this.itemsSequelize, this.shopsResourcesSequelize);
  public shopUseCase: ShopUseCase = new ShopUseCase(this.shopSequelize, this.subscriptionSequelize, this.shopProductsSequelize);
  public productsUseCase: ProductsUseCase = new ProductsUseCase(this.productsSequelize);
  public userUseCase: UserUseCase = new UserUseCase(this.userSequelize, this.tokenUsersSequelize, this.authenticatesCodesSequelize);

  public subscriptionController: SubscriptionController = new SubscriptionController(this.subscriptionUseCase);
  public paypalAppWebHookController: PaypalAppWebHookController = new PaypalAppWebHookController(this.paypalService, this.subscriptionUseCase);
  public usersController: UsersController = new UsersController(this.userUseCase);
  public itemsController: ItemsController = new ItemsController(this.itemsUseCase);
  public guestController: GuestController = new GuestController(this.guestUseCase, this.itemsUseCase, this.productsUseCase);
  public productsController: ProductsController = new ProductsController(this.productsUseCase);
  public shopController: ShopController = new ShopController(this.shopUseCase);
  public uploadcontroller: Uploadcontroller = new Uploadcontroller();
}

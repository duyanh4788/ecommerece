import { Request, Response } from 'express';
import { SendRespone } from '../services/success/success';
import { RestError } from '../services/error/error';
import { SubscriptionUseCase } from '../usecase/SubscriptionUseCase';
import { TypeOfValue, isCheckedTypeValues } from '../utils/validate';
import { sequelize } from '../database/sequelize';
import { Tier } from '../interface/SubscriptionInterface';
import { URL, URLSearchParams } from 'url';
import { envConfig } from '../config/envConfig';
import { Messages } from '../common/messages';

export class SubscriptionController {
  constructor(private subscriptionUseCase: SubscriptionUseCase) {}

  public adminFindAllSubscription = async (req: Request, res: Response) => {
    try {
      const subscriptions = await this.subscriptionUseCase.adminFindAllSubscriptionUseCase();
      return new SendRespone({ data: subscriptions }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public adminFindAllInvoices = async (req: Request, res: Response) => {
    try {
      const subscriptions = await this.subscriptionUseCase.adminFindAllInvoicesUseCase();
      return new SendRespone({ data: subscriptions }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public shopGetSubscription = async (req: Request, res: Response) => {
    try {
      const { shopId } = req.params;
      if (!isCheckedTypeValues(shopId, TypeOfValue.STRING)) {
        throw new RestError(Messages.NOT_AVAILABLE, 404);
      }
      const subscription = await this.subscriptionUseCase.shopGetSubscriptionUseCase(shopId);
      return new SendRespone({ data: subscription || null }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public getPlans = async (req: Request, res: Response) => {
    try {
      const plans = await this.subscriptionUseCase.findAllPlanUseCase();
      return new SendRespone({ data: plans }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public shopGetInvoices = async (req: Request, res: Response) => {
    try {
      const { shopId } = req.params;
      if (!isCheckedTypeValues(shopId, TypeOfValue.STRING)) {
        throw new RestError(Messages.NOT_AVAILABLE, 404);
      }
      const subscription = await this.subscriptionUseCase.shopGetInvoicesUseCase(shopId);
      return new SendRespone({ data: subscription }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public shopSubscriber = async (req: Request, res: Response) => {
    const transactionDB = await sequelize.transaction();
    try {
      const { tier, shopId } = req.body;
      if (!isCheckedTypeValues(tier, TypeOfValue.STRING) || !isCheckedTypeValues(shopId, TypeOfValue.STRING) || !Object.values(Tier).includes(tier)) {
        throw new RestError(Messages.NOT_AVAILABLE, 404);
      }
      const { user } = req;
      const links = await this.subscriptionUseCase.subscriberUseCase(tier, shopId, user.userId, transactionDB);
      await transactionDB.commit();
      return new SendRespone({ data: links }).send(res);
    } catch (error) {
      await transactionDB.rollback();
      return RestError.manageServerError(res, error, false);
    }
  };

  public shopChanged = async (req: Request, res: Response) => {
    try {
      const { tier, shopId } = req.body;
      if (!isCheckedTypeValues(tier, TypeOfValue.STRING) || !isCheckedTypeValues(shopId, TypeOfValue.STRING) || !Object.values(Tier).includes(tier)) {
        throw new RestError(Messages.NOT_AVAILABLE, 404);
      }
      const { user } = req;
      const links = await this.subscriptionUseCase.changeUseCase(tier, shopId, user.userId);
      return new SendRespone({ data: links }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public shopCanceled = async (req: Request, res: Response) => {
    try {
      const { subscriptionId, shopId, reason } = req.body;
      if (!isCheckedTypeValues(subscriptionId, TypeOfValue.STRING) || !isCheckedTypeValues(shopId, TypeOfValue.STRING) || !isCheckedTypeValues(reason, TypeOfValue.STRING)) {
        throw new RestError(Messages.NOT_REQ_AVAILABLE, 404);
      }
      const { user } = req;
      await this.subscriptionUseCase.cancelUseCase(subscriptionId, reason, shopId, user.userId);
      return new SendRespone({ message: Messages.CANCEL_SUBS_SHOP_OK }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public responseSuccess = async (req: Request, res: Response) => {
    try {
      const urlString = req.url;
      const url = new URL(urlString, `http://${req.headers.host}`);
      const searchParams = new URLSearchParams(url.search);
      const subscriptionId = searchParams.get('subscription_id');
      await this.subscriptionUseCase.responseSuccessUseCase(subscriptionId);
      return new SendRespone({ data: envConfig.FE_URL + '/profile' }).redirect(res);
    } catch (error) {
      return new SendRespone({ data: envConfig.FE_URL }).redirect(res);
    }
  };
}

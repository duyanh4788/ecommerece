import { Request, Response } from 'express';
import { SendRespone } from '../services/success/success';
import { RestError } from '../services/error/error';
import { SubscriptionUseCase } from '../usecase/SubscriptionUseCase';
import { TypeOfValue, isCheckedTypeValues } from '../utils/validate';
import { sequelize } from '../database/sequelize';
import { Tier } from '../interface/SubscriptionInterface';
import { URL, URLSearchParams } from 'url';

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

  public userGetSubscription = async (req: Request, res: Response) => {
    try {
      const { user } = req;
      const subscription = await this.subscriptionUseCase.userGetSubscriptionUseCase(user.userId);
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

  public userGetInvoices = async (req: Request, res: Response) => {
    try {
      const { user } = req;
      const subscription = await this.subscriptionUseCase.userGetInvoicesUseCase(user.userId);
      return new SendRespone({ data: subscription }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public userSubscriber = async (req: Request, res: Response) => {
    const transactionDB = await sequelize.transaction();
    try {
      const { tier } = req.body;
      if (!isCheckedTypeValues(tier, TypeOfValue.STRING) || !Object.values(Tier).includes(tier)) {
        throw new RestError('tier not available!', 404);
      }
      const { user } = req;
      const links = await this.subscriptionUseCase.subscriberUseCase(tier, user.userId, transactionDB);
      await transactionDB.commit();
      return new SendRespone({ data: links }).send(res);
    } catch (error) {
      await transactionDB.rollback();
      return RestError.manageServerError(res, error, false);
    }
  };

  public userChanged = async (req: Request, res: Response) => {
    try {
      const { tier } = req.body;
      if (!isCheckedTypeValues(tier, TypeOfValue.STRING) || !Object.values(Tier).includes(tier)) {
        throw new RestError('tier not available!', 404);
      }
      const { user } = req;
      const links = await this.subscriptionUseCase.changeUseCase(tier, user.userId);
      return new SendRespone({ data: links }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public userCanceled = async (req: Request, res: Response) => {
    try {
      const { subscriptionId, reason } = req.body;
      if (!isCheckedTypeValues(subscriptionId, TypeOfValue.STRING) || !isCheckedTypeValues(reason, TypeOfValue.STRING)) {
        throw new RestError('request not available!', 404);
      }
      const { user } = req;
      await this.subscriptionUseCase.cancelUseCase(subscriptionId, reason, user.userId);
      return new SendRespone({ message: 'canceled successfully, please waiting system sync with Paypal!' }).send(res);
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
      const notification = 'please waiting system sync with Paypal!';
      return new SendRespone({ data: process.env.FE_URL + '/profile?notification=' + encodeURIComponent(notification) }).redirect(res);
    } catch (error) {
      return new SendRespone({ data: process.env.FE_URL }).redirect(res);
    }
  };
}

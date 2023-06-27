import { Transaction } from 'sequelize';
import { Subscription } from '../interface/SubscriptionInterface';

export interface ISubscriptionRepository {
  findAll(): Promise<Subscription[]>;

  findByUserId(userId: string): Promise<Subscription>;

  findBySubscriptionId(subscriptionId: string): Promise<Subscription>;

  createOrUpdate(reqBody: Subscription, transactionDB: Transaction): Promise<Subscription>;
}

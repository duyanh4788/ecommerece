import { Transaction } from 'sequelize';
import { UsersResourcesInterface } from '../interface/UsersResourcesInterface';

export interface IUsersResourcesRepository {
  findByUserId(userId: string): Promise<UsersResourcesInterface>;

  findById(id: string): Promise<UsersResourcesInterface>;

  create(reqBody: UsersResourcesInterface, subscriptionId: string, transactionDb?: Transaction): Promise<UsersResourcesInterface>;

  decretIncre(userId: string, value: any, type: string, num: number, subscriptionId: string, transactionDb?: Transaction): Promise<void>;
}

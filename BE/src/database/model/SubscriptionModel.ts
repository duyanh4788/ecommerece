import { Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, ForeignKey, AllowNull, HasOne, Index, BelongsTo } from 'sequelize-typescript';
import { UsersModel } from './UsersModel';
import { PaypalBillingPlansModel } from './PaypalBillingPlansModel';
import { UsersResourcesModel } from './UsersResourcesModel';

@Table({
  tableName: 'subscriptions'
})
export class SubscriptionModel extends Model<SubscriptionModel> {
  @PrimaryKey
  @ForeignKey(() => UsersModel)
  @Column
  public userId: number;
  @BelongsTo(() => UsersModel)
  user: UsersModel;

  @AllowNull
  @ForeignKey(() => PaypalBillingPlansModel)
  @Column
  public planId: string;
  @BelongsTo(() => PaypalBillingPlansModel)
  paypalBillingPlans: PaypalBillingPlansModel;

  @Index
  @AllowNull
  @Column
  public subscriptionId: string;

  @AllowNull
  @Column
  public status: string;

  @AllowNull
  @Column
  public isTrial: boolean;

  @Column
  public lastPaymentsFetch: Date;

  @Column
  public paymentProcessor: string;

  @CreatedAt
  @Column
  public created_at: Date;

  @UpdatedAt
  @Column
  public updated_at: Date;

  @HasOne(() => UsersResourcesModel)
  usersResources: UsersResourcesModel;
}

import { Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, ForeignKey, AllowNull, HasOne, Index, BelongsTo } from 'sequelize-typescript';
import { UsersModel } from './UsersModel';
import { PaypalBillingPlansModel } from './PaypalBillingPlansModel';
import { ShopsModel } from './ShopsModel';
import { ShopsResourcesModel } from './ShopsResourcesModel';

@Table({
  tableName: 'subscriptions'
})
export class SubscriptionModel extends Model<SubscriptionModel> {
  @PrimaryKey
  @ForeignKey(() => ShopsModel)
  @Column
  public shopId: number;
  @BelongsTo(() => ShopsModel)
  shops: ShopsModel;

  @Index
  @Column
  @ForeignKey(() => UsersModel)
  public userId: number;
  @BelongsTo(() => UsersModel)
  user: UsersModel;

  @Index
  @AllowNull
  @Column
  @ForeignKey(() => PaypalBillingPlansModel)
  public planId: string;
  @BelongsTo(() => PaypalBillingPlansModel)
  paypalBillingPlans: PaypalBillingPlansModel;

  @Index
  @AllowNull
  @Column
  public subscriptionId: string;

  @Index
  @AllowNull
  @Column
  public status: string;

  @AllowNull
  @Column
  public eventType: string;

  @AllowNull
  @Column
  public isTrial: boolean;

  @Column
  public lastPaymentsFetch: Date;

  @Column
  public paymentProcessor: string;

  @CreatedAt
  @Column
  public createdAt: Date;

  @UpdatedAt
  @Column
  public updatedAt: Date;

  @HasOne(() => ShopsResourcesModel)
  shopsResources: ShopsResourcesModel;
}

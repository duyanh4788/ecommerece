import { Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, ForeignKey, AllowNull, BelongsTo } from 'sequelize-typescript';
import { UsersModel } from './UsersModel';
import { PaypalBillingPlansModel } from './PaypalBillingPlansModel';

@Table({
  tableName: 'subscriptions'
})
export class SubscriptionModel extends Model<SubscriptionModel> {
  @PrimaryKey
  @ForeignKey(() => UsersModel)
  @Column
  public userId: number;

  @AllowNull
  @ForeignKey(() => PaypalBillingPlansModel)
  @Column
  public planId: string;
  @BelongsTo(() => PaypalBillingPlansModel)
  paypalBillingPlans: PaypalBillingPlansModel;

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
}

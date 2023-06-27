import { Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, DataType, AllowNull, HasOne } from 'sequelize-typescript';
import { SubscriptionFrequency, Tier } from '../../interface/SubscriptionInterface';
import { SubscriptionModel } from './SubscriptionModel';

@Table({
  tableName: 'paypal_billing_plans'
})
export class PaypalBillingPlansModel extends Model<PaypalBillingPlansModel> {
  @PrimaryKey
  @Column(DataType.STRING)
  public tier: Tier;

  @Column(DataType.STRING)
  public frequency: SubscriptionFrequency;

  @PrimaryKey
  @Column
  public planId: string;

  @Column
  public amount: number;

  @PrimaryKey
  @Column
  public numberProduct: number;

  @PrimaryKey
  @Column
  public numberIndex: number;

  @PrimaryKey
  @Column
  public isTrial: boolean;

  @CreatedAt
  @Column
  public created_at: Date;

  @UpdatedAt
  @Column
  public updated_at: Date;

  @HasOne(() => SubscriptionModel)
  subscription: SubscriptionModel;
}

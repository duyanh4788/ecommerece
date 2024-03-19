import { Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, DataType, BelongsTo, ForeignKey, Index, HasOne } from 'sequelize-typescript';
import { SubscriptionFrequency, Tier } from '../../interface/SubscriptionInterface';
import { SubscriptionModel } from './SubscriptionModel';

@Table({
  tableName: 'paypal_billing_plans'
})
export class PaypalBillingPlansModel extends Model<PaypalBillingPlansModel> {
  @PrimaryKey
  @Index
  @Column
  public planId: string;

  @PrimaryKey
  @Index
  @Column(DataType.STRING)
  public tier: Tier;

  @Column(DataType.STRING)
  public frequency: SubscriptionFrequency;

  @Column
  public amount: number;

  @Column
  public numberProduct: number;

  @Column
  public numberItem: number;

  @Index
  @Column
  public isTrial: boolean;

  @CreatedAt
  @Column
  public createdAt: Date;

  @UpdatedAt
  @Column
  public updatedAt: Date;

  @HasOne(() => SubscriptionModel)
  subscription: SubscriptionModel;
}

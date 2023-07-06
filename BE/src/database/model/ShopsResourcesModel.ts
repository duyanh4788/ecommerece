import { Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement, ForeignKey, AllowNull, BelongsTo } from 'sequelize-typescript';
import { Index } from 'sequelize-typescript';
import { SubscriptionModel } from './SubscriptionModel';

@Table({
  tableName: 'shops_resources'
})
export class ShopsResourcesModel extends Model<ShopsResourcesModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @ForeignKey(() => SubscriptionModel)
  @AllowNull
  @Column
  @Index
  public shopId: number;
  @BelongsTo(() => SubscriptionModel)
  subscriptions: SubscriptionModel;

  @AllowNull
  @Column
  public numberProduct: number;

  @AllowNull
  @Column
  public numberItem: number;

  @CreatedAt
  @Column
  public createdAt: Date;

  @UpdatedAt
  @Column
  public updatedAt: Date;
}

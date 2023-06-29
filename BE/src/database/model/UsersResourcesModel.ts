import { Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement, ForeignKey, AllowNull, BelongsTo } from 'sequelize-typescript';
import { Index } from 'sequelize-typescript';
import { SubscriptionModel } from './SubscriptionModel';

@Table({
  tableName: 'users_resources'
})
export class UsersResourcesModel extends Model<UsersResourcesModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @ForeignKey(() => SubscriptionModel)
  @AllowNull
  @Column
  @Index
  public userId: number;
  @BelongsTo(() => SubscriptionModel)
  subscriptions: SubscriptionModel;

  @AllowNull
  @Column
  public numberProduct: number;

  @AllowNull
  @Column
  public numberIndex: number;

  @CreatedAt
  @Column
  public createdAt: Date;

  @UpdatedAt
  @Column
  public updatedAt: Date;
}

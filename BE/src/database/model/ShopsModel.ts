import { Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement, ForeignKey, AllowNull, BelongsTo, DataType, HasMany, HasOne, Index } from 'sequelize-typescript';
import { UsersModel } from './UsersModel';
import { ItemsModel } from './ItemsModel';
import { SubscriptionModel } from './SubscriptionModel';
import { InvoicesModel } from './InvoicesModel';

@Table({
  tableName: 'shops'
})
export class ShopsModel extends Model<ShopsModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @Index
  @AllowNull
  @Column
  @ForeignKey(() => UsersModel)
  public userId: number;
  @BelongsTo(() => UsersModel)
  users: UsersModel;

  @Index
  @AllowNull
  @Column
  public nameShop: string;

  @AllowNull
  @Column(DataType.JSON)
  public prodcutSell: any[];

  @AllowNull
  @Column(DataType.JSON)
  public banners: string[];

  @AllowNull
  @Column(DataType.JSON)
  public sliders: string[];

  @AllowNull
  @Column
  public numberProduct: number;

  @AllowNull
  @Column
  public numberItem: number;

  @Index
  @AllowNull
  @Column({ defaultValue: false })
  public status: boolean;

  @CreatedAt
  @Column
  public createdAt: Date;

  @UpdatedAt
  @Column
  public updatedAt: Date;

  @HasOne(() => SubscriptionModel)
  subscription: SubscriptionModel;

  @HasMany(() => ItemsModel)
  items: ItemsModel[];

  @HasMany(() => InvoicesModel)
  invoices: InvoicesModel[];
}

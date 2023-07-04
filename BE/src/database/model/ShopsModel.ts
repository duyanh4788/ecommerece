import { Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement, ForeignKey, AllowNull, BelongsTo, DataType, HasMany } from 'sequelize-typescript';
import { UsersModel } from './UsersModel';
import { ItemsModel } from './ItemsModel';

@Table({
  tableName: 'shops'
})
export class ShopsModel extends Model<ShopsModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @ForeignKey(() => UsersModel)
  @AllowNull
  @Column
  public userId: number;
  @BelongsTo(() => UsersModel)
  users: UsersModel;

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

  @AllowNull
  @Column({ defaultValue: false })
  public status: boolean;

  @CreatedAt
  @Column
  public createdAt: Date;

  @UpdatedAt
  @Column
  public updatedAt: Date;

  @HasMany(() => ItemsModel)
  items: ItemsModel[];
}

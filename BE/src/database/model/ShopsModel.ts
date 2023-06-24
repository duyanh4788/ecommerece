import { Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement, ForeignKey, AllowNull, BelongsTo, DataType } from 'sequelize-typescript';
import { UsersModel } from './UsersModel';

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
  @Column({ defaultValue: false })
  public status: boolean;

  @CreatedAt
  @Column
  public createdAt: Date;

  @UpdatedAt
  @Column
  public updatedAt: Date;
}

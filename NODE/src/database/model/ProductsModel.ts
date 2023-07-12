import { Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement, AllowNull, HasMany } from 'sequelize-typescript';
import { ItemsModel } from './ItemsModel';

@Table({
  tableName: 'products'
})
export class ProductsModel extends Model<ProductsModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @AllowNull
  @Column
  public nameProduct: string;

  @Column
  public avatar: string;

  @AllowNull
  @Column({ defaultValue: true })
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

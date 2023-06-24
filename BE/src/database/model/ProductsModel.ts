import { Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement, AllowNull } from 'sequelize-typescript';

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
}

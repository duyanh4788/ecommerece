import { Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement, ForeignKey, AllowNull, HasMany, HasOne, Index, BelongsTo, DataType } from 'sequelize-typescript';
import { ProductsModel } from './ProductsModel';
import { ShopsModel } from './ShopsModel';

@Table({
  tableName: 'shop_products'
})
export class ShopProductsModel extends Model<ShopProductsModel> {
  @Index
  @AllowNull
  @Column
  @ForeignKey(() => ShopsModel)
  public shopId: number;
  @BelongsTo(() => ShopsModel)
  shops: ShopsModel;

  @Index
  @AllowNull
  @Column
  @ForeignKey(() => ProductsModel)
  public productId: number;
  @BelongsTo(() => ProductsModel)
  products: ProductsModel;

  @AllowNull
  @Column(DataType.BOOLEAN)
  public status: boolean;

  @CreatedAt
  @Column
  public createdAt: Date;

  @UpdatedAt
  @Column
  public updatedAt: Date;
}

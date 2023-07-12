import { Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, ForeignKey, AutoIncrement, DataType, BelongsTo, AllowNull, HasMany, HasOne, Index } from 'sequelize-typescript';
import { ShopsModel } from './ShopsModel';
import { ProductsModel } from './ProductsModel';
import { EntityValuesModel } from './EAV/EntityValuesModel';

@Table({
  tableName: 'items'
})
export class ItemsModel extends Model<ItemsModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @Index
  @Column
  @ForeignKey(() => ShopsModel)
  public shopId: number;
  @BelongsTo(() => ShopsModel)
  shops: ShopsModel;

  @Index
  @Column
  @ForeignKey(() => ProductsModel)
  public productId: number;
  @BelongsTo(() => ProductsModel)
  products: ProductsModel;

  @Index
  @AllowNull
  @Column
  public nameItem: string;

  @AllowNull
  @Column(DataType.JSON)
  public itemThumb: string[];

  @AllowNull
  @Column
  public description: string;

  @AllowNull
  @Column
  public prices: number;

  @AllowNull
  @Column({ defaultValue: 0 })
  public quantityStock: number;

  @AllowNull
  @Column({ defaultValue: 0 })
  public quantitySold: number;

  @AllowNull
  @Column
  public brandName: string;

  @AllowNull
  @Column
  public origin: string;

  @Index
  @AllowNull
  @Column
  public typeProduct: string;

  @CreatedAt
  @Column
  public created_at: Date;

  @UpdatedAt
  @Column
  public updated_at: Date;

  @HasOne(() => EntityValuesModel)
  entityValues: EntityValuesModel;
}

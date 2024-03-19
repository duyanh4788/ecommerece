import { Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, ForeignKey, AutoIncrement, DataType, BelongsTo, AllowNull, Index, HasMany, HasOne } from 'sequelize-typescript';
import { ItemsModel } from '../ItemsModel';
import { EntityCosmesticsModel } from './EntityCosmesticsModel';
import { EntityFunituresModel } from './EntityFunituresModel';
import { EntityElectronicsModel } from './EntityElectronicsModel';
import { EntityClothersModel } from './EntityClothersModel';

@Table({
  tableName: 'entity_values'
})
export class EntityValuesModel extends Model<EntityValuesModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @PrimaryKey
  @Index
  @Column
  @ForeignKey(() => ItemsModel)
  public itemId: number;
  @BelongsTo(() => ItemsModel)
  items: ItemsModel;

  @CreatedAt
  @Column
  public createdAt: Date;

  @UpdatedAt
  @Column
  public updatedAt: Date;

  @HasOne(() => EntityCosmesticsModel)
  entityCosmestics: EntityCosmesticsModel;

  @HasOne(() => EntityFunituresModel)
  entityFunitures: EntityFunituresModel;

  @HasOne(() => EntityElectronicsModel)
  entityElectronics: EntityElectronicsModel;

  @HasOne(() => EntityClothersModel)
  entityClothers: EntityClothersModel;
}

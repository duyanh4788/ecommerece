import { Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, ForeignKey, AutoIncrement, DataType, BelongsTo, AllowNull, Index, HasMany } from 'sequelize-typescript';
import { EntityValuesModel } from './EntityValuesModel';

@Table({
  tableName: 'entity_cosmetics'
})
export class EntityCosmesticsModel extends Model<EntityCosmesticsModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @PrimaryKey
  @Index
  @Column
  @ForeignKey(() => EntityValuesModel)
  public entityId: number;
  @BelongsTo(() => EntityValuesModel)
  entityValues: EntityValuesModel;

  @AllowNull
  @Column
  public volume: string;

  @AllowNull
  @Column
  public weight: string;

  @AllowNull
  @Column
  public activesIngredients: string;

  @AllowNull
  @Column
  public expiry: string;

  @CreatedAt
  @Column
  public created_at: Date;

  @UpdatedAt
  @Column
  public updated_at: Date;
}

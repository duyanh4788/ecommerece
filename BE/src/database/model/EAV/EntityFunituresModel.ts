import { Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, ForeignKey, AutoIncrement, DataType, BelongsTo, AllowNull, Index, HasMany } from 'sequelize-typescript';
import { EntityValuesModel } from './EntityValuesModel';

@Table({
  tableName: 'entity_funitures'
})
export class EntityFunituresModel extends Model<EntityFunituresModel> {
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
  public size: string;

  @AllowNull
  @Column
  public material: string;

  @AllowNull
  @Column
  public warranty: boolean;

  @AllowNull
  @Column
  public manufactury: string;

  @AllowNull
  @Column
  public funtion: string;

  @CreatedAt
  @Column
  public created_at: Date;

  @UpdatedAt
  @Column
  public updated_at: Date;
}

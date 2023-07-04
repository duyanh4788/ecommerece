import { Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, ForeignKey, AutoIncrement, DataType, BelongsTo, AllowNull, Index, HasMany } from 'sequelize-typescript';
import { EntityValuesModel } from './EntityValuesModel';

@Table({
  tableName: 'entity_clothes'
})
export class EntityClothersModel extends Model<EntityClothersModel> {
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
  public color: string;

  @AllowNull
  @Column
  public material: string;

  @AllowNull
  @Column
  public size: string;

  @AllowNull
  @Column
  public styleList: string;

  @CreatedAt
  @Column
  public created_at: Date;

  @UpdatedAt
  @Column
  public updated_at: Date;
}

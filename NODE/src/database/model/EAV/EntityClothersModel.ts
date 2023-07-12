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

  @Column
  public color: string;

  @Column
  public material: string;

  @Column
  public size: string;

  @Column
  public styleList: string;

  @CreatedAt
  @Column
  public created_at: Date;

  @UpdatedAt
  @Column
  public updated_at: Date;
}

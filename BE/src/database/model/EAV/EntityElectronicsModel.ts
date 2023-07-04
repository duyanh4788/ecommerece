import { Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, ForeignKey, AutoIncrement, DataType, BelongsTo, AllowNull, Index, HasMany } from 'sequelize-typescript';
import { EntityValuesModel } from './EntityValuesModel';

@Table({
  tableName: 'entity_electronics'
})
export class EntityElectronicsModel extends Model<EntityElectronicsModel> {
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

  @Column
  public storage: string;

  @Column
  public screenSize: string;

  @AllowNull
  @Column
  public weight: string;

  @AllowNull
  @Column
  public technology: string;

  @AllowNull
  @Column
  public warranty: boolean;

  @CreatedAt
  @Column
  public created_at: Date;

  @UpdatedAt
  @Column
  public updated_at: Date;
}

import { Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement, ForeignKey, AllowNull, Unique, HasMany, BelongsTo, DataType, Index } from 'sequelize-typescript';
import { UsersModel } from './UsersModel';

@Table({
  tableName: 'token_users'
})
export class TokenUserModel extends Model<TokenUserModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @Index
  @AllowNull
  @Column
  @ForeignKey(() => UsersModel)
  public userId: number;
  @BelongsTo(() => UsersModel)
  users: UsersModel;

  @AllowNull
  @Column
  public publicKey: string;

  @AllowNull
  @Column
  public privateKey: string;

  @Column(DataType.JSON)
  public tokens: string[];

  @AllowNull
  @Column(DataType.JSON)
  public refreshTokens: string[];

  @CreatedAt
  @Column
  public createdAt: Date;

  @UpdatedAt
  @Column
  public updatedAt: Date;
}

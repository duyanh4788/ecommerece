import { Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement, ForeignKey, AllowNull, Unique, HasMany, BelongsTo, Index } from 'sequelize-typescript';
import { TokenUserModel } from './TokenUserModel';
import { UsersModel } from './UsersModel';

@Table({
  tableName: 'authenticates_codes'
})
export class AuthenticatesCodesModel extends Model<AuthenticatesCodesModel> {
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

  @Index
  @AllowNull
  @Column
  public authCode: string;

  @AllowNull
  @Column
  public dateTimeCreate: Date;

  @CreatedAt
  @Column
  public createdAt: Date;

  @UpdatedAt
  @Column
  public updatedAt: Date;
}

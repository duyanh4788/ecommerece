import { Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement, ForeignKey, AllowNull, Unique, HasMany, BelongsTo } from 'sequelize-typescript';
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

  @AllowNull
  @ForeignKey(() => UsersModel)
  @Column
  public userId: number;

  @BelongsTo(() => UsersModel)
  users: UsersModel;

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

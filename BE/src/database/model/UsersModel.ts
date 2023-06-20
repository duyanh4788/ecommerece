import { Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement, ForeignKey, AllowNull, Unique, HasMany } from 'sequelize-typescript';
import { TokenUserModel } from './TokenUserModel';

@Table({
  tableName: 'users'
})
export class UsersModel extends Model<UsersModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @AllowNull
  @Column
  public fullName: string;

  @AllowNull
  @Unique
  @Column
  public email: string;

  @AllowNull
  @Column
  public password: string;

  @AllowNull
  @Column
  public roleId: string;

  @Column
  public phone: number;

  @Column({ defaultValue: true })
  public activate: boolean;

  @CreatedAt
  @Column
  public createdAt: Date;

  @UpdatedAt
  @Column
  public updatedAt: Date;

  @HasMany(() => TokenUserModel)
  tokenUsers: TokenUserModel;
}

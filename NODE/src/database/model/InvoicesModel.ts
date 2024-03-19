import { Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, ForeignKey, AutoIncrement, DataType, Index } from 'sequelize-typescript';
import { UsersModel } from './UsersModel';
import { ShopsModel } from './ShopsModel';

@Table({
  tableName: 'invoices'
})
export class InvoicesModel extends Model<InvoicesModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @Index
  @Column
  @ForeignKey(() => ShopsModel)
  public shopId: number;

  @Index
  @Column
  @ForeignKey(() => UsersModel)
  public userId: number;

  @Column
  public paidAt: Date;

  @Column(DataType.DECIMAL)
  public amount: number;

  @Column
  public currency: string;

  @Column(DataType.DECIMAL)
  public gst: number;

  @Column
  public renewsDate: Date;

  @Column(DataType.DECIMAL)
  public totalAmount: number;

  @Column
  public invoiceFrom: Date;

  @Column
  public invoiceTo: Date;

  @Column
  public planType: string;

  @Index
  @Column
  public paymentProcessorId: string;

  @Column
  public paymentProcessor: string;

  @CreatedAt
  @Column
  public createdAt: Date;

  @UpdatedAt
  @Column
  public updatedAt: Date;
}

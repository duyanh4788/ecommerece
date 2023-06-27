import { Model, Column, Table, CreatedAt, UpdatedAt, PrimaryKey, ForeignKey, AutoIncrement, DataType } from 'sequelize-typescript';
import { UsersModel } from './UsersModel';

@Table({
  tableName: 'invoices'
})
export class InvoicesModel extends Model<InvoicesModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @PrimaryKey
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

  @Column
  public paymentProcessorId: string;

  @Column
  public paymentProcessor: string;

  @CreatedAt
  @Column
  public created_at: Date;

  @UpdatedAt
  @Column
  public updated_at: Date;
}

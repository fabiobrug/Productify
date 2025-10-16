import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'orders' })
export class Order extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.JSON, allowNull: false })
  declare items: Array<{
    productId: number;
    productName: string;
    productPrice: number;
    quantity: number;
  }>;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare totalAmount: number;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  declare createdAt: Date;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'pending' })
  declare status: 'pending' | 'confirmed' | 'cancelled';
}

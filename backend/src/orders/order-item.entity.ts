// src/orders/order-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column('int')
  qty!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order!: Order;
}

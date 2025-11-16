// src/orders/order.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string; // who created the order

  @Column()
  country!: string; // country of the order, set from user.country

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total!: number;

  @Column({ default: 'draft' })
  status!: 'draft' | 'placed' | 'cancelled';

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true, eager: true })
  items!: OrderItem[];

  @CreateDateColumn()
  createdAt!: Date;
}

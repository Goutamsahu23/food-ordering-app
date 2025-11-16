// src/payments/payment-method.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum PaymentType {
  CARD = 'card',
  UPI = 'upi',
  WALLET = 'wallet',
  COD = 'cod',
  OTHER = 'other',
}

@Entity({ name: 'payment_methods' })
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

   @Column({ type: 'text' })
  type!: string;

  @Column({ type: 'jsonb' })
  details!: any;

  // No user_id: methods are global
  @Column({ type: 'text', nullable: true })
  country?: string | null;

  @Column({ type: 'uuid', nullable: true })
  createdBy?: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}

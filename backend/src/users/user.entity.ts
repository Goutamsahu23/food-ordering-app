import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  ADMIN = 'admin',
  MANAGER = 'manager',
  MEMBER = 'member',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ type: 'enum', enum: Role, default: Role.MEMBER })
  role!: Role;

  @Column()
  country!: string;

  // @Column({ nullable: true })
  // paymentMethodId?: string;
}

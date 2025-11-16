import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { MenuItem } from '../menu/menu-item.entity';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  address?: string;

  // country string used for relational access scoping (e.g., "India", "America")
  @Column()
  country!: string;

  // optional restaurant image URL
  @Column({ nullable: true, type: 'text' })
  imageUrl?: string | null;

  @OneToMany(() => MenuItem, (menu) => menu.restaurant, { cascade: true })
  menu!: MenuItem[];
}

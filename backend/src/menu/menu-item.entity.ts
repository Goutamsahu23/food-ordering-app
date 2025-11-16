import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';

@Entity()
export class MenuItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('decimal', { precision: 8, scale: 2 })
  price!: number;

  // optional image url for this menu item
  @Column({ nullable: true, type: 'text' })
  imageUrl?: string | null;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menu, { onDelete: 'CASCADE' })
  restaurant!: Restaurant;
}

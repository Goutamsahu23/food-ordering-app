import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { MenuItem } from '../menu/menu-item.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restRepo: Repository<Restaurant>,
    @InjectRepository(MenuItem)
    private menuRepo: Repository<MenuItem>,
  ) {}

  // admin sees all, others only their country
  async findAllForUser(user: any) {
    if (!user) throw new ForbiddenException('Authentication required');
    if (user.role === 'admin') {
      return this.restRepo.find({ relations: ['menu'] });
    }
    return this.restRepo.find({ where: { country: user.country }, relations: ['menu'] });
  }

  async findOneForUser(user: any, id: string) {
    const restaurant = await this.restRepo.findOne({ where: { id }, relations: ['menu'] });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    if (user.role !== 'admin' && restaurant.country !== user.country) {
      throw new ForbiddenException('Access denied for restaurant in another country');
    }
    return restaurant;
  }

  // create restaurant: only admin should call this (controller will guard)
  async createRestaurant(payload: { name: string; address?: string; country?: string; imageUrl?: string | null }) {
    const rest = this.restRepo.create({
      name: payload.name,
      address: payload.address ?? null,
      country: payload.country ?? null,
      imageUrl: payload.imageUrl ?? null,
    } as Partial<Restaurant>);
    return this.restRepo.save(rest);
  }

  // add menu item to a restaurant: controller should check admin & country match
  async addMenuItem(userContext: any, restaurantId: string, payload: { name: string; price: number; imageUrl?: string | null }) {
    const rest = await this.restRepo.findOne({ where: { id: restaurantId } });
    if (!rest) throw new NotFoundException('Restaurant not found');

    const menu = this.menuRepo.create({
      name: payload.name,
      price: payload.price,
      imageUrl: payload.imageUrl ?? null,
      restaurant: rest,
    });

    return this.menuRepo.save(menu);
  }
}

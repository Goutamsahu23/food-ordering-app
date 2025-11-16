// src/orders/orders.service.ts
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Role } from '../users/user.entity';
import { PaymentMethod } from '../payments/payment-method.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private itemRepo: Repository<OrderItem>,
    @InjectRepository(PaymentMethod) private pmRepo: Repository<PaymentMethod>,
  ) { }

  // create order - allowed for all roles; order.country = user.country
  async createOrder(user: any, dto: CreateOrderDto) {
    const total = dto.items.reduce((s, i) => s + Number(i.price) * i.qty, 0);

    const order = this.orderRepo.create({
      userId: user.id,
      restaurantId: dto.restaurantId,
      country: user.country,
      total,
      status: 'draft',
      items: dto.items.map(i => ({
        name: i.name,
        qty: i.qty,
        price: i.price
      }))
    });

    return this.orderRepo.save(order);
  }


  // find orders for user (admin gets all)
  async findForUser(user: any) {
    if (user.role === Role.ADMIN) {
      return this.orderRepo.find({ order: { createdAt: 'DESC' } });
    }
    return this.orderRepo.find({ where: { country: user.country }, order: { createdAt: 'DESC' } });
  }

  // place order - only admin & manager
  async placeOrder(user: any, orderId: string, paymentMethodId?: string) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    if (user.role !== Role.ADMIN && user.role !== Role.MANAGER) {
      throw new ForbiddenException('Only admin or manager can place orders');
    }
    if (user.role !== Role.ADMIN && order.country !== user.country) {
      throw new ForbiddenException('Cannot place order in another country');
    }
    if (order.status === 'placed') throw new ForbiddenException('Order already placed.');
    if (order.status === 'cancelled') throw new ForbiddenException('Order already cancelled please re-order.');
    // if (order.status === 'placed') throw new ForbiddenException('Order already placed.');

    // Verify payment method exists and belongs to the user
    if (!paymentMethodId) {
      throw new BadRequestException('Payment method ID is required');
    }

    const pm = await this.pmRepo.findOne({ where: { id: paymentMethodId } });

    if (!pm) {
      throw new BadRequestException('Payment method not found');
    }

    order.status = 'placed';
    const saved = await this.orderRepo.save(order);
    return { ...saved, paymentMethodUsed: { id: pm.id, type: pm.type } };
  }

  // cancel order - admin & manager
  async cancelOrder(user: any, orderId: string) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (user.role !== Role.ADMIN && user.role !== Role.MANAGER) {
      throw new ForbiddenException('Only admin or manager can cancel orders');
    }
    if (user.role !== Role.ADMIN && order.country !== user.country) {
      throw new ForbiddenException('Cannot cancel order in another country');
    }
    if (order.status === 'cancelled') throw new ForbiddenException('Order already cancelled');
    order.status = 'cancelled';
    return this.orderRepo.save(order);
  }

  async findOneForUser(user: any, id: string) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    if (user.role !== Role.ADMIN && order.country !== user.country) {
      throw new ForbiddenException('Access denied for this order');
    }
    return order;
  }
}

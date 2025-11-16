// src/payments/payments.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { PaymentMethod, PaymentType } from './payment-method.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentRepo: Repository<PaymentMethod>,
  ) {}

  async findGlobalAndCountry(country?: string | null) {
    try {
      const normalizedCountry =
        typeof country === 'string' && country.trim().length > 0
          ? country.trim()
          : null;

      if (!normalizedCountry) {
        return this.paymentRepo.find({
          where: { country: IsNull() },
          order: { createdAt: 'ASC' },
        });
      }

      return this.paymentRepo.find({
        where: [
          { country: IsNull() },
          { country: normalizedCountry },
        ],
        order: { createdAt: 'ASC' },
      });
    } catch (err) {
      throw new BadRequestException('Failed to fetch payment methods.');
    }
  }

  async create(payload: Partial<PaymentMethod>) {
    try {
      const toSave = this.paymentRepo.create(payload);
      return await this.paymentRepo.save(toSave);
    } catch (err) {
      throw new BadRequestException('Failed to create payment method.');
    }
  }

  async update(id: string, payload: Partial<PaymentMethod>) {
    const method = await this.paymentRepo.findOne({ where: { id } });
    if (!method) throw new NotFoundException('Payment method not found.');

    try {
      Object.assign(method, payload);
      return await this.paymentRepo.save(method);
    } catch (err) {
      throw new BadRequestException('Failed to update payment method.');
    }
  }

  async remove(id: string) {
    const method = await this.paymentRepo.findOne({ where: { id } });
    if (!method) throw new NotFoundException('Payment method not found.');

    try {
      await this.paymentRepo.delete(id);
    } catch {
      throw new BadRequestException('Failed to delete payment method.');
    }
  }
}
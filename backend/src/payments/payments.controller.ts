// src/payments/payments.controller.ts
import { Controller, Patch, Body, Param, UseGuards, Get, Req, Delete, Post } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethod, PaymentType } from './payment-method.entity';
import { Request } from 'express';
import { PaymentsService } from './payments.service';

interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string; country: string };
}

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  // anyone authenticated can GET global methods
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Req() req: AuthRequest) {
    const user = req.user;

    // Admins see everything
    if (user?.role === 'admin') {
      const all = await this.paymentsService.findAll();
      return {
        success: true,
        message: 'Payment methods fetched successfully.',
        count: all.length,
        data: all,
      };
    }

    // Non-admins: global + country-specific
    const country = user?.country ?? null;
    const data = await this.paymentsService.findGlobalAndCountry(country);
    return {
      success: true,
      message: 'Payment methods fetched successfully.',
      count: data.length,
      data,
    };
  }

  // Admin-only create/update/delete
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() body: { type: PaymentType; details: any; country?: string }) {
    const created = await this.paymentsService.create(body);
    return {
      success: true,
      message: 'Payment method created successfully.',
      data: created,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const updated = await this.paymentsService.update(id, body);
    return {
      success: true,
      message: 'Payment method updated successfully.',
      data: updated,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.paymentsService.remove(id);
    return {
      success: true,
      message: 'Payment method deleted successfully.',
    };
  }
}
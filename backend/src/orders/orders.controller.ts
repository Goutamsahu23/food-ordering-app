// src/orders/orders.controller.ts
import { Controller, Post, UseGuards, Req, Body, Get, Param, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

interface AuthRequest extends Request {
    user?: { id: string; email: string; role: string; country: string };
}

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
    constructor(private ordersService: OrdersService) { }

    // create order - open for all authenticated users
    @Post('create')
    async create(@Req() req: any, @Body() body: CreateOrderDto) {
        return this.ordersService.createOrder(req.user, body);
    }

    // place order - only admin & manager
    @UseGuards(RolesGuard)
    @Roles('admin', 'manager')
    @Post(':id/place')
    async place(@Req() req: any, @Param('id') id: string, @Body() body: { paymentMethodId?: string }) {
        return this.ordersService.placeOrder(req.user, id, body?.paymentMethodId);
    }

    // cancel order - only admin & manager
    @UseGuards(RolesGuard)
    @Roles('admin', 'manager')
    @Delete(':id/cancel')
    async cancel(@Req() req: any, @Param('id') id: string) {
        return this.ordersService.cancelOrder(req.user, id);
    }

    // list orders - admin gets all; others only their country
    @Get()
    async list(@Req() req: any) {
        return this.ordersService.findForUser(req.user);
    }

    // get single order
    @Get(':id')
    async getOne(@Req() req: any, @Param('id') id: string) {
        return this.ordersService.findOneForUser(req.user, id);
    }
}

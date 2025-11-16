import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';

import { AuthModule } from './auth/auth.module';
import { TestModule } from './test/test.module';

import { RestaurantsModule } from './restaurants/restaurants.module';
import { Restaurant } from './restaurants/restaurant.entity';
import { MenuItem } from './menu/menu-item.entity';

import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/order.entity';
import { OrderItem } from './orders/order-item.entity';

import { PaymentsModule } from './payments/payments.module';
import { PaymentMethod } from './payments/payment-method.entity';
// import { AdminController } from './admin/admin.controller';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'foodapp',
      entities: [User, Restaurant, MenuItem, Order, OrderItem, PaymentMethod],
      autoLoadEntities: true,
      synchronize: true, // for dev only
      logging: false,
    }),
    TypeOrmModule.forFeature([User]),
    UsersModule,
    AuthModule,
    TestModule,  // just to test the api 
    RestaurantsModule,
    OrdersModule,
    PaymentsModule,
  ],
  controllers: [
    // AdminController,
  ],
  providers: [],
})
export class AppModule {}

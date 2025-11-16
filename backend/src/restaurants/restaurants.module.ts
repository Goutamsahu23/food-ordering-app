import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './restaurant.entity';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { MenuItem } from '../menu/menu-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, MenuItem])],
  providers: [RestaurantsService],
  controllers: [RestaurantsController],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}

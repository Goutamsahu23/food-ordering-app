import { Controller, Get, UseGuards, Req, Post, Body, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RestaurantsService } from './restaurants.service';
import { Request } from 'express';
import { AddMenuItemDto } from './dto/add-menu-item.dto';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

// simple typed request that contains user (populated by JwtStrategy)
interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
        country: string;
    };
}

@Controller('restaurants')
export class RestaurantsController {
    constructor(private readonly restaurantsService: RestaurantsService) { }

    // List restaurants visible to the user
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Req() req: AuthRequest) {
        const user = req.user;
        return this.restaurantsService.findAllForUser(user);
    }

    // Get restaurant + menu
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Req() req: AuthRequest, @Param('id') id: string) {
        return this.restaurantsService.findOneForUser(req.user, id);
    }

    // Create restaurant - admin only
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    async create(@Body() body: CreateRestaurantDto) {
        return this.restaurantsService.createRestaurant(body);
    }

    // Add menu item - admin only
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post(':id/menu')
    async addMenu(@Req() req: AuthRequest, @Param('id') id: string, @Body() body: AddMenuItemDto) {
        return this.restaurantsService.addMenuItem(req.user, id, body);
    }
}

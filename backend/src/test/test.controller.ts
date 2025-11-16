import { Controller, Get, Req, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('test')
export class TestController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req: any) {
    return { ok: true, user: req.user };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin')
  onlyAdmin(@Request() req: any) {
    return { ok: true, msg: 'hello admin', user: req.user };
  }
}

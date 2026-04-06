import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('me')
  getMe() {
    return {
      id: 'u1',
      email: 'customer@shopbot.vn',
      fullName: 'Demo Customer',
      role: 'customer',
    };
  }
}

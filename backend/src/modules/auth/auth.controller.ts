import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Body() body: { email?: string; password?: string }) {
    if (!body.email || !body.password) {
      throw new UnauthorizedException('Email or password is missing');
    }

    return {
      accessToken: 'mock_access_token_shopbot',
      refreshToken: 'mock_refresh_token_shopbot',
      user: {
        id: 'u1',
        email: body.email,
        role: 'customer',
      },
    };
  }
}

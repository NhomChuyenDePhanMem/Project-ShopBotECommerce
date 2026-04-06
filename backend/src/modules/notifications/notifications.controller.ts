import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.notificationsService.findByUser(userId);
  }

  @Post()
  create(
    @Body()
    body: {
      userId?: string;
      type?: 'order' | 'promotion' | 'system';
      channel?: 'email' | 'push';
      title?: string;
      body?: string;
    },
  ) {
    return this.notificationsService.create({
      userId: body.userId ?? 'u1',
      type: body.type ?? 'system',
      channel: body.channel ?? 'push',
      title: body.title ?? 'Thong bao',
      body: body.body ?? '',
    });
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string) {
    return this.notificationsService.markRead(id);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { mockNotifications, Notification } from '../../common/mock-data';

@Injectable()
export class NotificationsService {
  findByUser(userId: string) {
    return mockNotifications.filter((item) => item.userId === userId);
  }

  create(input: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) {
    const notification: Notification = {
      id: `n${mockNotifications.length + 1}`,
      createdAt: new Date().toISOString(),
      isRead: false,
      ...input,
    };
    mockNotifications.unshift(notification);
    return notification;
  }

  markRead(notificationId: string) {
    const notification = mockNotifications.find((item) => item.id === notificationId);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    notification.isRead = true;
    return notification;
  }
}

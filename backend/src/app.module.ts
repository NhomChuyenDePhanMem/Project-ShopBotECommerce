import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ChatbotModule } from './modules/chatbot/chatbot.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 40,
      },
    ]),
    ...(process.env.DB_ENABLED === 'true'
      ? [
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
              type: 'postgres',
              host: configService.get<string>('DB_HOST', 'localhost'),
              port: configService.get<number>('DB_PORT', 5432),
              username: configService.get<string>('DB_USERNAME', 'postgres'),
              password: configService.get<string>('DB_PASSWORD', 'admin'),
              database: configService.get<string>('DB_DATABASE', 'sshopbot'),
              autoLoadEntities: true,
              synchronize: true, // Use false in production
            }),
            inject: [ConfigService],
          }),
        ]
      : []),
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    ReviewsModule,
    NotificationsModule,
    ChatbotModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

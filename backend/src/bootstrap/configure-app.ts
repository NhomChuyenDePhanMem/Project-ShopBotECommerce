import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

const WEAK_JWT_SECRETS = new Set([
  'dev-jwt-secret-change-me',
  'thay-bang-chuoi-bi-mat-dai',
]);

export function validateProductionSecurity(config: ConfigService): void {
  const nodeEnv = config.get<string>('NODE_ENV', 'development');
  if (nodeEnv !== 'production') {
    return;
  }
  const secret = config.get<string>('JWT_SECRET', '');
  if (secret.length < 32) {
    throw new Error(
      'Production requires JWT_SECRET with at least 32 characters.',
    );
  }
  if (WEAK_JWT_SECRETS.has(secret.trim())) {
    throw new Error(
      'Production JWT_SECRET must not use a documented example value.',
    );
  }
  if (config.get<string>('TYPEORM_SYNC', 'true') === 'true') {
    throw new Error(
      'Production must set TYPEORM_SYNC=false to avoid unsafe schema auto-sync.',
    );
  }
}

function corsOptionsFromConfig(config: ConfigService): CorsOptions {
  const raw = config.get<string>('CORS_ORIGINS');
  if (raw?.trim()) {
    const origin = raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    return { origin, credentials: true };
  }
  return {
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ],
    credentials: true,
  };
}

/** HTTP hardening + CORS + validation — dùng chung `main.ts` và E2E `setup-app.ts`. */
export function configureHttpApp(app: INestApplication): void {
  const config = app.get(ConfigService);
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.enableCors(corsOptionsFromConfig(config));
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('ShopBot API')
    .setDescription('API docs for ShopBot ecommerce backend')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);
}

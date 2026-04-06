import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type AuthUserPayload = {
  userId: number;
  username: string;
  role: string;
  fullName: string;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUserPayload => {
    const request = ctx.switchToHttp().getRequest<{ user: AuthUserPayload }>();
    return request.user;
  },
);

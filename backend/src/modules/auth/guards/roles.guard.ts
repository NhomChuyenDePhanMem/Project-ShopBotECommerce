import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../constants';
import type { AuthUserPayload } from '../decorators/current-user.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required?.length) {
      return true;
    }
    const request = context.switchToHttp().getRequest<{ user?: AuthUserPayload }>();
    const user = request.user;
    if (!user?.role) {
      throw new ForbiddenException('Thiếu thông tin vai trò');
    }
    if (!required.includes(user.role)) {
      throw new ForbiddenException('Không đủ quyền truy cập');
    }
    return true;
  }
}

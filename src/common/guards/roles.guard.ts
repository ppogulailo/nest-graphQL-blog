import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext();
    const user = req.user;
    const hasRole = () => roles.indexOf(user.role) > -1;
    let hasPermission = false;
    if (hasRole()) {
      hasPermission = true;
    }
    return user && hasPermission;
  }
}

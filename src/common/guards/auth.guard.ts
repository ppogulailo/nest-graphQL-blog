import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { USER_NOT_AUTHORIZE } from '../../auth/const/auth.const';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../users/user.service';

@Injectable()
export class graphqlContextGetToken extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private userService: UserService,
  ) {
    super();
  }
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    try {
      const gqlContext = GqlExecutionContext.create(context);
      const { req } = gqlContext.getContext();
      const decodedToken = await this.authService.verifyUser(
        req.body.variables.Authorization,
      );
      // make sure that the user is not deleted, or that props or rights changed compared to the time when the jwt was issued
      const user = await this.userService.findById(decodedToken.id);
      if (user) {
        // add the user to our req object, so that we can access it later when we need it
        // if it would be here, we would like overwrite
        req.user = user;
        return true;
      } else {
        throw new UnauthorizedException(USER_NOT_AUTHORIZE);
      }
    } catch (e) {
      throw new UnauthorizedException(USER_NOT_AUTHORIZE);
    }
  }
}

import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserService } from 'src/users/user.service';
import { AuthService } from '../../auth/auth.service';
import { USER_NOT_AUTHORIZE } from '../../auth/constant/auth.constant';

@Injectable()
export class CustomAuthGuard extends AuthGuard('jwt') {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const gqlContext = GqlExecutionContext.create(context);
      const { req } = gqlContext.getContext();
      const decodedToken = await this.authService.verifyUser(
        req.body.variables.refreshToken.access_token,
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

import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/users/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class CustomAuthGuard extends AuthGuard('jwt') {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // custom logic can go here
    // this is necessary due to possibly returning `boolean | Promise<boolean> | Observable<boolean>
    // custom logic goes here too
    try {
      const req = context.switchToHttp().getRequest();
      const decodedToken = await this.authService.verifyUser(
        req.cookies.jwt.tokens.accessToken,
      );
      // make sure that the user is not deleted, or that props or rights changed compared to the time when the jwt was issued
      const user = await this.userService.getOneUser(decodedToken.id);
      if (user) {
        // add the user to our req object, so that we can access it later when we need it
        // if it would be here, we would like overwrite
        req.user = user;
        return true;
      } else {
        throw new UnauthorizedException('User is not auth');
      }
    } catch (e) {
      throw new UnauthorizedException('User is not auth');
    }
  }
}

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/users/user.entity';
import { UserService } from 'src/users/user.service';

@Injectable()
export class UserIsUserGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const params = request.params;
    const user: UserEntity = request.user;

    const findUser = await this.userService.getOneUser(user.id);
    let hasPermission = false;
    if (findUser.id === params.id) {
      hasPermission = true;
    }
    return user && hasPermission;
  }
}

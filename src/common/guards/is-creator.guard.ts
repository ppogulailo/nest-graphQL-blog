import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from '../../users/user.service';
import { BlogPostService } from '../../blog-post/blog-post.service';
import { Reflector } from '@nestjs/core';
import { ServiceType } from '../decorators/services.decoratir';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Roles } from '../../users/user.entity';

@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
    private blogPostService: BlogPostService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext();
    const args = gqlContext.getArgs();
    const serviceMap = {
      userService: this.userService,
      blogPostService: this.blogPostService,
    };
    const service = this.reflector.get<ServiceType>(
      'service',
      context.getHandler(),
    );
    const selectedService = serviceMap[service];
    const { user } = await selectedService.findById(args.id);
    // const { user, params }: { user: any; params: { id: number } } = req;
    //
    // if (!user || !params) return false;
    //
    if (req.user.role === Roles.Moderator) return true; // allow admins to get make requests
    //
    // const userId = user.id;
    // const feedId = params.id;
    console.log(user.id === req.user.id);
    return user.id === req.user.id;
  }
}

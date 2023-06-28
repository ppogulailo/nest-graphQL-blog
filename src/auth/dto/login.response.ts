import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '../../users/user.entity';

@ObjectType()
export class LoginResponse {
  @Field()
  access_token: string;
  @Field(() => UserEntity)
  user: UserEntity;
}

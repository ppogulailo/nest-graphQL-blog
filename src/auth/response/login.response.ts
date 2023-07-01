import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '../../users/user.entity';

@ObjectType()
export class LoginResponse {
  @Field()
  access_token: string;
  @Field(() => UserEntity)
  user: UserEntity;
  @Field()
  refresh_token: string;
}
@ObjectType()
export class RefreshResponse {
  @Field()
  access_token: string;
  @Field()
  refresh_token: string;
  @Field()
  id: number;
}

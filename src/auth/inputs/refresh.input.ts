import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RefreshInput {
  @Field()
  refresh_token: string;
  @Field()
  access_token: string;
  @Field()
  id: number;
}

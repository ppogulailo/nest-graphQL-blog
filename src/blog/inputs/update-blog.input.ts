import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateBlogInput {
  @Field(() => ID)
  id: number;
  @Field(() => String)
  name: string;
}

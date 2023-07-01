import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateBlogPostInput {
  @Field(() => ID)
  id: number;
  @Field(() => String)
  title: string;
}

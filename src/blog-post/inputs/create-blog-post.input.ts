import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBlogPostInput {
  @Field(() => String)
  title: string;
  @Field(() => String)
  message: string;
  @Field(() => Number)
  userId: number;
  @Field(() => Number)
  blogId: number;
}

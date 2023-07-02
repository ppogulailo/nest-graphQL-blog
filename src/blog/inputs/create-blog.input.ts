import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBlogInput {
  @Field(() => String)
  name: string;
}

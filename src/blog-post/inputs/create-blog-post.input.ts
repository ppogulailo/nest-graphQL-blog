import { Field, ID, InputType } from '@nestjs/graphql';
import {IsNumber, IsString} from "class-validator";

@InputType()
export class CreateBlogPostInput {
  @Field(() => String)
  @IsString()
  title: string;
  @Field(() => String)
  @IsString()
  message: string;
  @Field(() => Number)
  @IsNumber()
  blogId: number;
}

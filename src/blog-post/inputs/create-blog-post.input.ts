import { Field, ID, InputType } from '@nestjs/graphql';
import {IsNotEmpty, IsNumber, IsString} from "class-validator";

@InputType()
export class CreateBlogPostInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  title: string;
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  message: string;
  @Field(() => Number)
  @IsNumber()
  blogId: number;
}

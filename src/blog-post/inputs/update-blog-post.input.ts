import { Field, ID, InputType } from '@nestjs/graphql';
import {IsNumber, IsString} from "class-validator";

@InputType()
export class UpdateBlogPostInput {
  @Field(() => ID)
  @IsNumber()
  id: number;
  @Field(() => String)
  @IsString()
  title: string;
}

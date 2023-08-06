import { Field, ID, InputType } from '@nestjs/graphql';
import {IsNotEmpty, IsNumber, IsString} from "class-validator";

@InputType()
export class CreateBlogInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;
}

import { Field, ID, InputType } from '@nestjs/graphql';
import {IsNumber, IsString} from "class-validator";

@InputType()
export class CreateBlogInput {
  @Field(() => String)
  @IsString()
  name: string;
}

import { Field, ID, InputType } from '@nestjs/graphql';
import {IsNotEmpty, IsNumber, IsString} from "class-validator";

@InputType()
export class UpdateBlogInput {
  @Field(() => ID)
  @IsNumber()
  id: number;
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;
}

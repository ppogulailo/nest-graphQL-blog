import { Field, Int, ArgsType } from '@nestjs/graphql';
import {IsNumber, IsOptional, IsString, Max, Min} from "class-validator";

@ArgsType()
export class FetchBlogPostInput {
  @Field(() => Int)
  @Min(0)
  @IsOptional()
  @IsNumber()
  skip? = 0;
  @Field(() => Int)
  @Min(1)
  @Max(50)
  @IsOptional()
  @IsNumber()
  take? = 25;
  @Field(() => String)
  @IsOptional()
  @IsString()
  title? = '';
}

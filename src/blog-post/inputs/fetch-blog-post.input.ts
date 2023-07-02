import { Field, Int, ArgsType } from '@nestjs/graphql';
import { IsOptional, Max, Min } from "class-validator";

@ArgsType()
export class FetchBlogPostInput {
  @Field(() => Int)
  @Min(0)
  @IsOptional()
  skip? = 0;
  @Field(() => Int)
  @Min(1)
  @Max(50)
  @IsOptional()
  take? = 25;
  @Field(() => String)
  @IsOptional()
  title? = '';
}

import { Field, Int, ArgsType } from '@nestjs/graphql';
import {IsNumber, IsOptional, IsString, Max, Min} from "class-validator";

@ArgsType()
export class FetchBlogPostInput {
  @Field(() => Int,{nullable:true})
  @Min(0)
  @IsOptional()
  @IsNumber()
  skip? = 0;
  @Field(() => Int,{nullable:true})
  @Min(1)
  @Max(50)
  @IsOptional()
  @IsNumber()
  take? = 25;
  @Field(() => String,{nullable:true})
  @IsOptional()
  @IsString()
  title? = '';
}
